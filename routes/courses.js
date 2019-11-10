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

router.get('/:id', async (req, res) => {
  const course = await Course.getById(req.params.id);
  res.render('course', {
    layout: 'empty',
    title: `Курс ${course.title}`,
    course
  });
})

module.exports = router; //экспортируем данный роут
