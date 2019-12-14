const {Router} = require('express'); //подключим объект Router
const {validationResult} = require('express-validator'); //подключим объект для валидации данных
const Course = require('../models/course'); //подключим модель course
const auth = require('../middleware/auth'); //подключим промежуточное ПО для проверки аутентификации
const {courseValidators} = require('../utils/validators'); //подключим объект для проверки данных
const router = Router(); //создадим экземпляр класса express.Router

//обработаем get запрос на страницу добавления курса
router.get('/', auth, (req, res) => {
  res.render('add', { //отобразим шаблон для страницы добавления курса
    title: 'Добавить курс', //зададим заголовок страницы
    isAdd: true //установим флаг в значение true
  })
})

//обработаем post запрос на страницу добавления курса
router.post('/', auth, courseValidators, async (req, res) => {
  const errors = validationResult(req); //присвоим переменной результат проверки данных

  if (!errors.isEmpty()) { //если есть ошибки
    //установим статус 422 и отобразим шаблон для страницы добавления курсов
    return res.status(422).render('add', {
      title: 'Добавить курс', //задаим заголовок страницы
      isAdd: true, //установим значение флага true
      error: errors.array()[0].msg, //выведем ошибку
      data: { //выведем данные
        title: req.body.title, //название курса
        price: req.body.price, //цена курса
        img: req.body.img //изображение
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
    console.log(e); //если есть ошибки, выведем их в консоль
  }
})

module.exports = router; //экспортируем данный роутер
