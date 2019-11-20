const keys = require('../keys');

module.exports = function(email) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Аккаунт создан',
    html: `
      <h1>Добро пожаловать в магазин</h1>
      <p>Вы успешно создали учётную запись с адресом электронной почты - ${email}</p>
      <hr />
      <a href="${keys.BASE_URL}">Магазин курсов</a>
    `
  }
}
