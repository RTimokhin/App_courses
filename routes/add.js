const {Router} = require('express');
const router = Router();

//обработаем get запрос на страницу add
router.get('/', (req, res) => {
  res.render('add', {
    title: 'Добавить',
    isAdd: true
  })
})

module.exports - router;
