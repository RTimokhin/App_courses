const {Router} = require('express'); //подключим объект Router
const bcrypt = require('bcryptjs'); //подключим модуль для шифрования паролей пользователей
const crypto = require('crypto'); //подключим модуль для шифрования данных
const {validationResult} = require('express-validator'); //подключим объект для проверки данных
const nodemailer = require('nodemailer'); //подключим пакет для отправки email
//подключим пакет для отправки email с помощью сервиса sendgrid
const sendgrid = require('nodemailer-sendgrid-transport');
const User = require('../models/user'); //подключим модель User
const keys = require('../keys'); //подключим модуль с ключами
const regEmail = require('../emails/registration'); //подключим модуль с объектом конфигурации эл. писем
const resetEmail = require('../emails/reset'); //подключим модуль с объектом конфигурации эл. писем
const {registerValidators} = require('../utils/validators'); //подключим объект для проверки данных
const router = Router(); //создадим экземпляр класса express.Router

//сконфигурируем объект для отправки email через api sendgrid
const transporter = nodemailer.createTransport(sendgrid({
  auth: {api_key: keys.SENDGRID_API_KEY}
}))

//создадим обработчик для get запроса на страницу авторизации
router.get('/login', async (req, res) => {
  res.render('auth/login', { //отобразим шаблон из папки auth
    title: 'Авторизация', //зададим заголовок страницы
    isLogin: true, //установим флаг isLogin в значение true
    loginError: req.flash('loginError'), //передадим данные об ошибке аутентификации, если они есть
    registerError: req.flash('registerError') //передадим данные об ошибке регистрации, если они есть
  })
})

//создадим обработчик для get запроса по маршруту /logout
router.get('/logout', async (req, res) => {
  req.session.destroy(() => { //уничтожим сеанс сессии
    res.redirect('/auth/login#login'); //перенаправим запрос на страницу авторизации
  })
})

//добавим обработчик для post запроса по маршруту /login
router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body; //получим два поля из объекта req.body
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
    const user = new User({ //создадим нового пользователя
      email, name, password: hashPassword, cart: {items: []}
    })
    await user.save(); //дождемся сохранения данных
    await transporter.sendMail(regEmail(email)); //отправим пользователю письмо с подтверждением регистрации
    res.redirect('/auth/login#login'); //перенаправим запрос на страницу аутентификации
  } catch (e) {
    console.log(e); //выведем текст ошибки в консоль
  }
})

//создадим обработчик для get запроса по маршруту /reset
router.get('/reset', (req, res) => {
  res.render('auth/reset', { //отобразим страницу для сброса пароля
    title: 'Забыли пароль?', //зададим заголовок для страницы
    error: req.flash('error') //выведем текст ошибки, если она есть
  })
})

//создадим обработчик для get запроса на страницу обновления забытого пароля
router.get('/password/:token', async (req, res) => {
  if (!req.params.token) { //если токена не существует
    return res.redirect('/auth/login'); //перенаправим запрос на страницу авторизации
  }

  try {
    const user = await User.findOne({ //найдём запись пользователя, отвечающую нужным параметрам
      resetToken: req.params.token, //идентификатор токена из параметров маршрута
      resetTokenExp: {$gt: Date.now()} //срок действия токена
    })

    if (!user) { //если запись не найдена
      return res.redirect('/auth/login'); //перенаправим запрос на страницу авторизации
    } else {
      res.render('auth/password', { //иначе, отобразим страницу восстановления пароля
        title: 'Восстановить доступ', //заголовок страницы
        error: req.flash('error'), //если есть ошибки, выведем их
        userId: user._id.toString(), //идентификатор пользователя
        token: req.params.token //идентификатор токена
      })
    }
  } catch (e) {
    console.log(e); //если есть ошибки, выведем их в консоль
  }

})

//обработаем post запрос по маршруту /reset
router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => { //сгенерируем идентификатор токена
      if (err) { //если есть ошибка, выведем сообщение
        req.flash('error', 'Что-то пошло не так, повторите попытку позже');
        return res.redirect('/auth/reset'); //перенаправим запрос на страницу сброса пароля
      }

      const token = buffer.toString('hex'); //присвоим идентификатор токена переменной
      //найдем запись пользователя с указанным email
      const candidate = await User.findOne({email: req.body.email});

      if (candidate) { //если пользователь найден
        candidate.resetToken = token; //присвоим идентификатор пользователя
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000; //зададим срок действия токена
        await candidate.save(); //сохраним данные
        await transporter.sendMail(resetEmail(candidate.email, token)); //отправим email пользователю
        res.redirect('/auth/login'); // //перенаправим запрос на страницу авторизации
      } else { //иначе, выведем сообщение
        req.flash('error', 'Такого адреса не существует');
        res.redirect('/auth/reset'); //перенаправим запрос на страницу сброса пароля
      }
    })
  } catch (e) {
    console.log(e); //если есть ошибки, выведем их в консоль
  }
})

//обработаем post запрос по маршруту /password
router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({ //найдём запись пользователя, отвечающую нужным параметрам
      _id: req.body.userId, //идентификатор пользователя
      resetToken: req.body.token, //идетификатор токена
      resetTokenExp: {$gt: Date.now()} //срок действия токена
    })

    if (user) { //если пользователь найден
      user.password = await bcrypt.hash(req.body.password, 10); //обновим пароль пользователя
      user.resetToken = undefined; //сбросим идентификатор токена
      user.resetTokenExp = undefined; //сбросим срок действия токена
      await user.save(); //сохраним данные
      res.redirect('/auth/login'); //перенаправим запрос на страницу авторизации
    } else { //иначе, выведем сообщение
      req.flash('loginError', 'Время жизни токена истекло');
      res.redirect('/auth/login'); //перенаправим запрос на страницу авторизации
    }
  } catch (e) {
    console.log(e); //если есть ошибки, выведем их в консоль
  }
})

module.exports = router; //экспортируем данный роутер
