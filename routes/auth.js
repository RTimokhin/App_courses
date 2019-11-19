const {Router} = require('express');
const User = require('../models/user');
const router = Router();

//создадим обработчик для get запроса по маршруту /login
router.get('/login', async (req, res) => {
  res.render('auth/login', { //отобразим шаблон login из папки auth
    title: 'Авторизация', //зададим заголовок страницы
    isLogin: true //установим флаг isLogin в значение true
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
  const user = await User.findById('5dd1767bb409491ed489e9fc');
  req.session.user = user; //в поле user объекта session добавим данного пользователя
  req.session.isAuthenticated = true; //после аутентификации установим данный флаг в значение true
  req.session.save(err => {
    if(err) {
      throw err
    }
    res.redirect('/'); //перенаправим запрос на главную страницу
  })
})

//добавим обработчик для post запроса по маршруту /register
router.post('/register', async (req, res) => {
  try {
    //заберем необходимые поля из объекта req.body
    const {email, password, repeat, name} = req.body;
    //присвоим переменной candidate результат поиска в модели User пользователя с данным email
    const candidate = await User.findOne({email});
    if(candidate) { //если пользователь с данным email существует
      res.redirect('/auth/login#register'); //перенаправим запрос на страницу регистрации
    } else {
      const user = new User({ //иначе, создадим нового пользователя
        email, name, password, cart: {items: []}
      })
      await user.save(); //дождемся сохранения данных
      res.redirect('/auth/login#login'); //перенаправим запрос на
    }
  } catch(err) {
    console.log(err);
  }
})

module.exports = router; //экспортируем данный роутер
