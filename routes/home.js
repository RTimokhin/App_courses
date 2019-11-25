const {Router} = require('express');
const router = Router();

//обработаем get запрос на главную страницу
router.get('/', (req, res) => {
  res.render('index', { //отобразим на странице данные из шаблона index.hbs
    title: 'Главная страница',
    isHome: true
  })
})

module.exports = router;  //экспортируем данный роут
