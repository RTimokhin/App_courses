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
  const course = new Course({ //создадим новый объект на основе модели Course
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user
  })

  try {
    await course.save(); //сохраним данные
    res.redirect('/courses'); //перенаправим пользователя на страницу курсов
  } catch(err) {
    console.log(err);
  }
})

module.exports = router; //экспортируем данный роут
