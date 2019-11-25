const User = require('../models/user'); //экспортируем модель User

//создадим и экспортируем middleware
module.exports = async function(req, res, next) {
  if (!req.session.user) { //если ни один пользователь не авторизован
    return next(); //завершим middleware и передадим управление следующему обработчику
  }
  //иначе, получим и сохраним данные пользователя в поле req.user
  req.user = await User.findById(req.session.user._id);
  next();
}
