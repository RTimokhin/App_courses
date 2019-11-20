const {Router} = require('express');
const bcrypt = require('bcryptjs'); //подключим модуль для шифрования данных
const nodemailer = require('nodemailer');
const sendGrid = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const keys - require('../keys');
const regEmail = require('../emails/registration');
const router = Router();

const transporter = nodemailer.createTransport(sendGrid({
  auth: {api_key: keys.SENDGRID_API_KEY}
}))

//создадим обработчик для get запроса по маршруту /login
router.get('/login', async (req, res) => {
  res.render('auth/login', { //отобразим шаблон login из папки auth
    title: 'Авторизация', //зададим заголовок страницы
    isLogin: true, //установим флаг isLogin в значение true
    loginError: req.flash('loginError'), //передадим данные об ошибке
    registerError: req.flash('registerError') //передадим данные об ошибке
  })
})

//создадим обработчик для get запроса по маршруту /logout
router.get('/logout', async (req, res) => {
  res.session.destroy( () => { //очистим все данные, зарегистрированные за сеанс
    res.redirect('/auth/login#login'); //после очистки данных, перенаправим запрос
  })
})

//добавим обработчик для post запроса по маршруту /login
router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body; //получим поля из объекта req.body
    //присвоим переменной candidate результат поиска в модели User пользователя с данным email
    const candidate = await User.findOne({email});
    if(candidate) { //если пользователь с таким email существует
      const areSame = await bcrypt.compare(password, candidate.password); //сравним введенный пароль и пароль в БД
      if(areSame) { //если пароли совпадают
        req.session.user = candidate; //в поле user объекта session добавим данного пользователя
        req.session.isAuthenticated = true; //после аутентификации установим данный флаг в значение true
        req.session.save(err => {
          if(err) {
            throw err
          }
          res.redirect('/'); //перенаправим запрос на главную страницу
        })
      } else {
        req.flash('loginError', 'Неверный пароль');
        res.redirect('/auth/login#login'); //иначе, перенаправим запрос на страницу аутентификации
      }
    } else {
      req.flash('loginError', 'Такого пользователя не существует');
      res.redirect('/auth/login#login');
    }
  } catch(err) {
    console.log(err);
  }
})

//добавим обработчик для post запроса по маршруту /register
router.post('/register', async (req, res) => {
  try {
    //заберем необходимые поля из объекта req.body
    const {email, password, repeat, name} = req.body;
    //присвоим переменной candidate результат поиска в модели User пользователя с данным email
    const candidate = await User.findOne({email});
    if(candidate) { //если пользователь с данным email существует
      req.flash('registerError', 'Пользователь с данным email уже существует'); //выведем сообщение об ошибке
      res.redirect('/auth/login#register'); //перенаправим запрос на страницу регистрации
    } else {
      const hashPassword = await bcrypt.hash(password, 10); //зашифруем пароль с помощью bcrypt
      const user = new User({ //иначе, создадим нового пользователя
        email, name, password: hashPassword, cart: {items: []}
      })
      await user.save(); //дождемся сохранения данных
      res.redirect('/auth/login#login'); //перенаправим запрос на
      await transporter.sendMail(regEmail(email)); //отправим пользователю письмо с подтверждением регистрации
    }
  } catch(err) {
    console.log(err);
  }
})

module.exports = router; //экспортируем данный роутер
