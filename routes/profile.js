const {Router} = require('express'); //подключим объект Router из пакета express
const auth = require('../middleware/auth'); //подключим модуль для проверки аутентифкации
const router = Router;

//создадим обработчик для get запроса по маршруту /profile
router.get('/', async (req, res) => {
  res.render('profile', { //отобразим шаблон представления profile
    title: 'Профиль', //зададим заголовок страницы
    isProfile: true, //обозначим активную ссылку в навигации
    user: req.user.toObject() //создадим объект user с данными текущего пользователя
  })
})

router.post('/', async (req, res) => {

})

module.exports = router;
