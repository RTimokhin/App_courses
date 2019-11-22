const {body} = require('express-validator');
const User = require('../models/user');
//проверим введённые данные на соответствие необходимым условиям валидации
exports.registerValidators = [
  //задаим условия валидации для поля email
  body('email').isEmail().withMessage('Введите корректный email').custom(async (value, {req}) => {
    try {
      //проверим существует ли пользователь с указанным email
      const user = await User.findOne({email: value});
      if (user) { //если существует, выведем сообщение
        return Promise.reject('Такой email уже занят');
      }
    } catch(err) {
      console.log(err);
    }
  })
  .normalizeEmail(),
  //зададим условия валидации для пароля
  body('password', 'Пароль должен состоять из минимум 6 символов')
  .isLength({min: 6, max: 56}).isAlphanumeric().trim(),
  //зададим условия валидации для поля confirm
  body('confirm').custom( (value, {req}) => {
    if(value !== req.body.password) {
      throw new Error('Пароли должны совпадать');
    }
    return true;
  })
  .trim(),
  //зададим условия валидации дяя поля name
  body('name').isLength({min: 3}).withMessage('Имя должно состоять из минимум 3 символов')
  .trim()
]

exports.courseValidators = [
  //добавим валидаторы для поля ввода названия курса
  body('tiitle').isLength({min: 3}).withMessage('Минимальное длина названия 3 символа').trim(),
  //добавим валидатор для поля ввода цены курса
  body('price').isAlphanumeric().withMessage('Введите корректную цену для курса'),
  //добавим валидатор для поля ввода url изображения
  body('img', 'Введите корректный url изображения').isURL()
]
