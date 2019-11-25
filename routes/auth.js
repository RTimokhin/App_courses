const {Router} = require('express');
const bcrypt = require('bcryptjs'); //подключим модуль для шифрования паролей пользователей
const crypto = require('crypto'); //подключим модуль для шифрования данных
const {validationResult} = require('express-validator');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const keys = require('../keys');
const regEmail = require('../emails/registration');
const resetEmail = require('../emails/reset');
const {registerValidators} = require('../utils/validators');
const router = Router();

const transporter = nodemailer.createTransport(sendgrid({
  auth: {api_key: keys.SENDGRID_API_KEY}
}))

//создадим обработчик для get запроса по маршруту /login
router.get('/login', async (req, res) => {
  res.render('auth/login', { //отобразим шаблон из папки auth
    title: 'Авторизация', //зададим заголовок страницы
    isLogin: true, //установим флаг isLogin в значение true
    loginError: req.flash('loginError'), //передадим данные об ошибке аутентификации
    registerError: req.flash('registerError') //передадим данные об ошибке регистрации
  })
})

//создадим обработчик для get запроса по маршруту /logout
router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  })
})

//добавим обработчик для post запроса по маршруту /login
router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body; //получим поля из объекта req.body
    //присвоим переменной candidate результат поиска в модели User пользователя с данным email
    const candidate = await User.findOne({ email });
    if (candidate) { //если пользователь с таким email существует
      const areSame = await bcrypt.compare(password, candidate.password); //сравним введенный пароль и пароль в БД
      if (areSame) { //если пароли совпадают
        req.session.user = candidate; //в поле user объекта session добавим данного пользователя
        req.session.isAuthenticated = true; //после аутентификации установим данный флаг в значение true
        req.session.save(err => { //сохраним данные сессии
          if (err) { //обработаем ошибки, если они есть
            throw err;
          }
          res.redirect('/'); //перенаправим запрос на главную страницу
        })
      } else {
        req.flash('loginError', 'Неверный пароль'); //если пароли не совпадают, выведем сообщение
        res.redirect('/auth/login#login'); //перенаправим запрос на страницу аутентификации
      }
    } else {
      req.flash('loginError', 'Такого пользователя не существует'); //если пользователь не найден
      res.redirect('/auth/login#login'); //перенаправим запрос на страницу аутентификации
    }
  } catch (e) {
    console.log(e); //если есть ошибки, выведем текст ошибки в консоль
  }
})

//добавим обработчик для post запроса по маршруту /register
//с помощью ПО registerValidators проверим отвечают ли данные, введённые в поле email необходимым условиям
router.post('/register', registerValidators, async (req, res) => {
  try {
    //заберем необходимые поля из объекта req.body
    const {email, password, name} = req.body;
    const errors = validationResult(req); //получим имеющиеся ошибки валидации
    if (!errors.isEmpty()) { //если есть ошибки
      req.flash('registerError', errors.array()[0].msg); //выведем сообщение
      //зададим статус для ответа и перенаправим запрос на другую страницу
      return res.status(422).redirect('/auth/login#register');
    }
    const hashPassword = await bcrypt.hash(password, 10); //зашифруем пароль с помощью bcrypt
    const user = new User({ //иначе, создадим нового пользователя
      email, name, password: hashPassword, cart: {items: []}
    })
    await user.save(); //дождемся сохранения данных
    await transporter.sendMail(regEmail(email)); //отправим пользователю письмо с подтверждением регистрации
    res.redirect('/auth/login#login'); //перенаправим запрос на страницу аутентификации
  } catch (e) {
    console.log(e); //выведем текст ошибки в консоль
  }
})

router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Забыли пароль?',
    error: req.flash('error')
  })
})

router.get('/password/:token', async (req, res) => {
  if (!req.params.token) {
    return res.redirect('/auth/login');
  }

  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: {$gt: Date.now()}
    })

    if (!user) {
      return res.redirect('/auth/login');
    } else {
      res.render('auth/password', {
        title: 'Восстановить доступ',
        error: req.flash('error'),
        userId: user._id.toString(),
        token: req.params.token
      })
    }
  } catch (e) {
    console.log(e);
  }

})

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Что-то пошло не так, повторите попытку позже');
        return res.redirect('/auth/reset');
      }

      const token = buffer.toString('hex');
      const candidate = await User.findOne({email: req.body.email});

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
        await candidate.save();
        await transporter.sendMail(resetEmail(candidate.email, token));
        res.redirect('/auth/login');
      } else {
        req.flash('error', 'Такого email нет');
        res.redirect('/auth/reset');
      }
    })
  } catch (e) {
    console.log(e);
  }
})

router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: {$gt: Date.now()}
    })

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      res.redirect('/auth/login');
    } else {
      req.flash('loginError', 'Время жизни токена истекло');
      res.redirect('/auth/login');
    }
  } catch (e) {
    console.log(e);
  }
})

module.exports = router; //экспортируем данный роутер
