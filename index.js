const express = require('express'); //импортируем пакет express
const path = require('path'); //модуль для работы с путями
const app = express(); //создадим объект, представляющий приложение
//функция createApplication из файла lib/express.js является функцией, экспортируемой по умолчанию,
//именно к ней мы обращаемся, выполняя вызов функции express()

//обработаем get запрос на главную страницу
//отобразим в ответ на запрос файл index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
})

//обработаем get запрос на страницу about.html
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
})

const PORT = process.env.PORT || 2000; //по умолчанию значение порта 2000

app.listen(PORT, () => { //слушаем нужный порт
  //если сервер запущен, вызывается callback ф-ия, выводящая сообщение в консоль
  console.log(`Server is running on port ${PORT}`);
})
