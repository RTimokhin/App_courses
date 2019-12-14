const {Router} = require('express'); //подключим объект Router
const router = Router(); //создадим экземпляр класса express.Router

//обработаем get запрос на главную страницу
router.get('/', (req, res) => {
  res.render('index', { //отобразим на странице данные из шаблона index.hbs
    title: 'Главная страница', //зададим заголовк страницы
    isHome: true //зададим флагу isHome значение true
  })
})

module.exports = router;  //экспортируем данный роут
