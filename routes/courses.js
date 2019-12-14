const {Router} = require('express'); //подключим объект Router
const {validationResult} = require('express-validator'); //подключим объект для проверки данных
const Course = require('../models/course'); //импортируем модель Course
const auth = require('../middleware/auth'); //подключим модуль для проверки аутентификации
const {courseValidators} = require('../utils/validators'); //подключим объект для проверки данных
const router = Router(); //создадим экземпляр класса express.Router

//создадим проверку на совпадение идентификатора автора курса и текущего пользователя
function isOwner(course, req) {
  return course.userId.toString() === req.user._id.toString();
}

//обработаем get запрос на страницу courses
router.get('/', async (req, res) => {
  try {
    //найдем все существующие в БД курсы
    const courses = await Course.find().populate('userId', 'email name').select('price title img');
    //отобразим на странице данные из шаблона courses
    res.render('courses', {
      title: 'Курсы', //зададим заголовок для страницы
      isCourses: true, //установим флаг в значение true
      userId: req.user ? req.user._id.toString() : null,
      courses: courses //выведем данные курсов
    })
  } catch (e) {
    console.log(e); //если есть ошибки, выведем их в консоль
  }
})

//создадим обработчик для страницы редактирования курса
router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {  //если query параметра, отвечающего за редактирование курса нет
    return res.redirect('/'); //перенаправим запрос на главную страницу
  }

  try {
    const course = await Course.findById(req.params.id); //получим id курса
    //если идентификатор автора курса не совпадает с идетификатором текущего пользователя
    if (!isOwner(course, req)) {
      return res.redirect('/courses'); //перенаправим запрос на страницу /courses
    }

    res.render('course-edit', {  //отобразим шаблон страницы редактирования курса
      title: `Редактировать ${course.title}`, //зададим заголовок для страницы
      course: course //выведем данные курса
    })
  } catch (e) {
    console.log(e); //если есть ошибки, выведем их в консоль
  }
})

//создадим обработчик для post запроса на редактирование курса
router.post('/edit', auth, courseValidators, async (req, res) => {
  const errors = validationResult(req); //присвоим переменной результат проверки данных
  const {id} = req.body;

  if (!errors.isEmpty()) { //если есть ошибки
    //установим статус 422 и перенаправим запрос на страницу редактирования курса
    return res.status(422).redirect(`/courses/${id}/edit?allow=true`);
  }

  try {
    delete req.body.id; //удалим id курса
    const course = await Course.findById(id); //найдем курс по его id
    //если идентификатор автора курса не совпадает с идентификатором текущего пользователя
    if (!isOwner(course, req)) {
      return res.redirect('/courses'); //перенаправим запрос на страницу курсов
    }
    Object.assign(course, req.body);  //заменим определенные поля объекта
    await course.save(); //сохраним данные
    res.redirect('/courses'); //перенаправим запрос на страницу курсов
  } catch (e) {
    console.log(e); //если есть ошибки, выведем их в консоль
  }
})

//создадим обработчик для post запроса удаления курса
router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({ //удалим курс, соответствующий параметрам
      _id: req.body.id,
      userId: req.user._id
    })
    res.redirect('/courses'); //перенаправим запрос на страницу курсов
  } catch (e) {
    console.log(e); //если есть ошибки, выведем их в консоль
  }
})

//создадим обработчик для get запроса на страницу с курсом
router.get('/:id', async (req, res) => {
  try {
    //найдем курс по его идентификатору
    const course = await Course.findById(req.params.id);
    res.render('course', { //отобразим шаблон для страницы курсов
      layout: 'empty', //отобразим лейаут
      title: `Курс ${course.title}`, //зададим заголовок для страницы
      course: course //выведем данные курса
    })
  } catch (e) {
    console.log(e); //если есть ошибки, выведем их в консоль
  }
})

module.exports = router;  //экспортируем роутер
