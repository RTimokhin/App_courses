const {Router} = require('express');
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

router.post('/login', async (req, res) => {
  req.session.isAuthenticated = true; //после аутентификации установим данный флаг в значение true
  res.redirect('/'); //перенаправим запрос на главную страницу
})

module.exports = router; //экспортируем данный роутер
