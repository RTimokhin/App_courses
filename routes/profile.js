const {Router} = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');
const router = Router();

router.get('/', auth, async (req, res) => {
  res.render('profile', {
    title: 'Профиль',
    isProfile: true,
    user: req.user.toObject()
  })
})

router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const toChange = {
      name: req.body.name
    }

    if (req.file) { //если есть файл в форме
      toChange.avatarUrl = req.file.path; //заменим изображение
    }

    Object.assign(user, toChange);
    await user.save(); //дождемся сохранения данных
    res.redirect('/profile'); //перенаправим запрос на страницу профиля
  } catch (e) {
    console.log(e);
  }
})

module.exports = router; //экспортируем роут
