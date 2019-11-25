const {Router} = require('express'); //подключим фраймворк express
const {validationResult} = require('express-validator');
const Course = require('../models/course'); //импортируем модель Course
const auth = require('../middleware/auth'); //подключим модуль для проверки аутентификации
const {courseValidators} = require('../utils/validators');
const router = Router();

//создадим проверку на совпадение идентификатора автора курса и текущего пользователя
function isOwner(course, req) {
  return course.userId.toString() === req.user._id.toString();
}

//обработаем get запрос на страницу courses
router.get('/', async (req, res) => {
  try {
    //найдем все существующие в БД курсы и добавим информацию о пользователе email, name
    const courses = await Course.find().populate('userId', 'email name').select('price title img');
    //отобразим на странице данные из шаблона courses.hbs
    res.render('courses', {
      title: 'Курсы',
      isCourses: true,
      userId: req.user ? req.user._id.toString() : null,
      courses: courses
    })
  } catch (e) {
    console.log(e);
  }
})

//создадим обработчик для маршрута /:id/edit
router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {  //если query параметра, отвечающего за редактирование курса нет
    return res.redirect('/'); //перенаправим запрос на главную страницу
  }

  try {
    const course = await Course.findById(req.params.id); //получим id курса
    //если идентификатор автора курса не совпадает с идетификатором текущего пользователя
    if (!isOwner(course, req)) {
      return res.redirect('/courses');  //перенаправим запрос на страницу /courses
    }

    res.render('course-edit', {  //отобразим данные на странице course-edit
      title: `Редактировать ${course.title}`,
      course: course
    })
  } catch (e) {
    console.log(e);
  }
})

//создадим обработчик для post запроса на странице /edit
router.post('/edit', auth, courseValidators, async (req, res) => {
  const errors = validationResult(req);
  const {id} = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).redirect(`/courses/${id}/edit?allow=true`);
  }

  try {
    delete req.body.id;
    const course = await Course.findById(id);
    if (!isOwner(course, req)) {
      return res.redirect('/courses');
    }
    Object.assign(course, req.body);  //заменим определенные поля
    await course.save(); //сохраним данные
    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
})

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
      userId: req.user._id
    })
    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
})

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render('course', {
      layout: 'empty',
      title: `Курс ${course.title}`,
      course
    })
  } catch (e) {
    console.log(e);
  }
})

module.exports = router;  //экспортируем данный обработчик
