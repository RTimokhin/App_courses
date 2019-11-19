//создадим промежуточное middleware для проверки аутентификации
module.exports = function(req, res, next) {
  if(!req.session.isAuthenticated) { //если пользователь не прошел аутентификацию
    return res.redirect('/auth/login'); //перенаправим запрос на страницу аутентификации
  }
  next();
}
