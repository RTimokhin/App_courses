const {Router} = require('express'); //подключим объект Router
const auth = require('../middleware/auth'); //подключим промежуточное ПО для проверки аутентификации
const User = require('../models/user'); //подключим модель данных User
const router = Router(); //создадим экземпляр класса express.Router

//обработаем get запрос на страницу профиля пользователя
router.get('/', auth, async (req, res) => {
  res.render('profile', { //отобразим страницу профиля
    title: 'Профиль', //задаим заголовк страницы
    isProfile: true, //выставим флаг true
    user: req.user.toObject() //получим данные о пользователе
  })
})

//обработаем post запрос на форму изменения данных пользователя
router.post('/', auth, async (req, res) => {
  try {
    //найдем запись пользователя с нужным идентификатором
    const user = await User.findById(req.user._id);
    const toChange = {
      name: req.body.name //обновим имя пользователя
    }

    if (req.file) { //если есть файл в форме
      toChange.avatarUrl = req.file.path; //заменим изображение
    }
    //скопируем поля из объекта toChange и добавим их в объект user
    Object.assign(user, toChange);
    await user.save(); //дождемся сохранения данных
    res.redirect('/profile'); //перенаправим запрос на страницу профиля
  } catch (e) {
    console.log(e); //если есть ошибки, выведем их в консоль
  }
})

module.exports = router; //экспортируем роут
