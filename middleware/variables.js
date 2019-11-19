//создадим промежуточный обработчик для проверки авторизации
module.exports = function(req, res, next) {
  //добавим данные, которые будут передаваться с каждым ответом в шаблон
  res.locals.isAuth = req.session.isAuthenticated;
  res.locals.csrf = req.csrfToken();
  next(); //передадим управление следующему middleware
}
