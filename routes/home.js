const {Router} = require('express');
const router = Router();

//обработаем get запрос на главную страницу
router.get('/', (req, res) => {
  ////отобразим на странице данные из шаблона index.hbs
  res.render('index', {
    title: 'Главная страница',
    isHome: true
  })
})

module.exports = router; //экспортируем данный роут
