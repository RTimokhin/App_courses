const {Router} = require('express');
const Course = require('../models/course');
const router = Router();

//обработаем get запрос на страницу courses
router.get('/', async (req, res) => {
  const courses = await Course.getAll();
  //отобразим на странице данные из шаблона courses.hbs
  res.render('courses', {
    title: 'Курсы',
    isCourses: true
  })
})

//создадим обработчик для маршрута /:id/edit
router.get('/:id/edit', async (req, res) => {
  if(!req.query.allow) { //если query параметра, отвечающего за редактирование курса нет
    return res.redirect('/'); //то перенаправим запрос на главную страницу
  }
  const course = await Course.getById(req.param.id); //получим id курса
  res.render('course-edit', { //отобразим данные на странице course-edit
    title: `Редактировать ${course.title}`,
    course
  })
})

//создадим обработчик для post запроса на странице /edit
router.post('/edit', async (req, res) => {
  await Course.update(req.body); //обновим данные у модели курсов
  res.redirect('/courses'); //перенаправим на стриницу курсов
})

router.get('/:id', async (req, res) => {
  const course = await Course.getById(req.params.id);
  res.render('course', {
    layout: 'empty',
    title: `Курс ${course.title}`,
    course
  });
})

module.exports = router; //экспортируем данный роут
