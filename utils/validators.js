const {body} = require('express-validator');
const User = require('../models/user');

//проверим введённые данные на соответствие необходимым условиям валидации
exports.registerValidators = [
  //задаим условия валидации для поля email
  body('email')
    .isEmail().withMessage('Введите корректный email')
    .custom(async (value, {req}) => {
      try {
        //проверим существует ли пользователь с указанным email
        const user = await User.findOne({ email: value });
        if (user) { //если существует, выведем сообщение
          return Promise.reject('Такой email уже занят');
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
    //зададим условия валидации для пароля
  body('password', 'Пароль должен быть минимум 6 символов')
    .isLength({min: 6, max: 56})
    .isAlphanumeric()
    .trim(),
  //зададим условия валидации для поля confirm
  body('confirm')
    .custom((value, {req}) => {
      if (value !== req.body.password) {
        throw new Error('Пароли должны совпадать');
      }
      return true;
    })
    .trim(),
  //зададим условия валидации дяя поля name
  body('name')
    .isLength({min: 3}).withMessage('Имя должно быть минимум 3 символа')
    .trim()
]


exports.courseValidators = [
  //экспортируем валидаторы для поля ввода названия курса
  body('title').isLength({min: 3}).withMessage('Минимальная длинна названия 3 символа').trim(),
  //экспортируем валидаторы для поля ввода цены курса
  body('price').isNumeric().withMessage('Введите корректную цену'),
  //экспортируем валидаторы для поля ввода url изображения
  body('img', 'Введите корректный Url картинки').isURL()
];
