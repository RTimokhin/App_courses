const {Router} = require('express');
const router = Router();

//обработаем get запрос на страницу courses
router.get('/', (req, res) => {
  res.render('courses', {
    title: 'Курсы',
    isCourses: true
  })
})

module.exports - router;
