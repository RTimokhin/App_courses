const {Router} = require('express');
const Course = require('../models/course');
const router = Router();

//обработаем get запрос на страницу add
router.get('/', (req, res) => {
  res.render('add', {
    title: 'Добавить',
    isAdd: true
  })
})

//обработаем post запрос на страницу add
router.post('/', async (req, res) => {
  const course = new Course(req.body.title, req.body.price, req.body.img);
  await course.save();
  res.redirect('/courses');
})

module.exports = router;
