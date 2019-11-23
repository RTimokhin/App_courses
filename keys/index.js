if(process.env.NODE_ENV === 'production') { //если приложение запущено в продакшен моде
  module.exports = require('./keys.prod'); //экспортируем ключи из файла keys.prod
} else {
  module.exports = require('./keys.dev'); //иначе, экспортируем ключи из файла keys.dev
}
