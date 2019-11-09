const {Router} = require('express'); //подключим фраймворк express
const Course = require('../models/course'); //подключим модель course
const router = Router();

//обработаем get запрос на страницу add
router.get('/', (req, res) => {
  //отобразим данные из шаблона add.hbs на стринице add
  res.render('add', {
    title: 'Добавить',
    isAdd: true
  })
})

//обработаем post запрос на страницу add
router.post('/', async (req, res) => {
  //передадим переменной course значения с помощью схемы Course
  const course = new Course(req.body.title, req.body.price, req.body.img);
  await course.save(); //сохраним данные в ...
  res.redirect('/courses'); //перенаправим пользователя на страницу курсов
})

module.exports = router; //экспортируем модуль
