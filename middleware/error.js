//создадим и экспортируем функцию для обработки ошибки 404
module.exports = function(req, res, next) {
  res.status(404).render('404', {
    title: 'Страница не найдена'
  })
}
