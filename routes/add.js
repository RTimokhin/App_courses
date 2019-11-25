const {Router} = require('express'); //подключим фраймворк express
const {validationResult} = require('express-validator');
const Course = require('../models/course'); //подключим модель course
const auth = require('../middleware/auth');
const {courseValidators} = require('../utils/validators');
const router = Router();

//обработаем get запрос на страницу add
router.get('/', auth, (req, res) => {
  //отобразим данные из шаблона на стринице add
  res.render('add', {
    title: 'Добавить курс',
    isAdd: true
  })
})

//обработаем post запрос на страницу add
router.post('/', auth, courseValidators, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Добавить курс',
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.body.img
      }
    })
  }

  //создадим новый объект на основе модели Course
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user
  })

  try {
    await course.save(); //сохраним данные
    res.redirect('/courses'); //перенаправим пользователя на страницу курсов
  } catch (e) {
    console.log(e);
  }
})

module.exports = router; //экспортируем данный обработчик
