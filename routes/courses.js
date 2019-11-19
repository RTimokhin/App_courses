const {Router} = require('express'); //подключим фраймворк express
const Course = require('../models/course'); //импортируем модель Course
const router = Router();

//обработаем get запрос на страницу courses
router.get('/', async (req, res) => {
  //найдем все существующие в БД курсы и добавим информацию о пользователе email, name
  const courses = await Course.find().populate('userId', 'email name').select('price title img');
  //отобразим на странице данные из шаблона courses.hbs
  res.render('courses', {
    title: 'Курсы',
    isCourses: true,
    courses
  })
})

//создадим обработчик для маршрута /:id/edit
router.get('/:id/edit', auth, async (req, res) => {
  if(!req.query.allow) { //если query параметра, отвечающего за редактирование курса нет
    return res.redirect('/'); //то перенаправим запрос на главную страницу
  }
  const course = await Course.findById(req.param.id); //получим id курса
  res.render('course-edit', { //отобразим данные на странице course-edit
    title: `Редактировать ${course.title}`,
    course
  })
})

//создадим обработчик для post запроса на странице /edit
router.post('/edit', auth, async (req, res) => {
  const {id} = req.body
  delete req.body.id
  await Course.findByIdAndUpdate(id, req.body)
  res.redirect('/courses')
})

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({_id: req.body.id});
    res.redirect('/courses');
  } catch(err) {
  console.log(err);
  }
})

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render('course', {
    layout: 'empty',
    title: `Курс ${course.title}`,
    course
  });
})

module.exports = router; //экспортируем данный роут
