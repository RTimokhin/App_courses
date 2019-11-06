const express = require('express'); //импортируем пакет express
const path = require('path'); //модуль для работы с путями
const exphbs = require('express-handlebars'); //поключм шаблонизатор handlebars
const app = express(); //создадим объект, представляющий приложение
//функция createApplication из файла lib/express.js является функцией, экспортируемой по умолчанию,
//именно к ней мы обращаемся, выполняя вызов функции express()

//сконфигурируем handlebars
const hbs = exphbs.create({
  defaultLayout: 'main', //зададим layout по умолчанию
  extname: 'hbs' //зададим псевдоним
})

app.engine('hbs', hbs.engine); //регистрируем в express движок handlebars
app.set('view engine', 'hbs'); //устанавливаем handlebars как используемый движок представления
app.set('views', 'views'); //название папки, где будут храниться шаблоны

app.use(express.static('public')); //сделаем папку public статической
//теперь express при подгрузке страниц с адресом / обращается к папке public

//обработаем get запрос на главную страницу
app.get('/', (req, res) => {
  res.render('index');
})

//обработаем get запрос на страницу about.html
app.get('/about', (req, res) => {
  res.render('about');
})

const PORT = process.env.PORT || 2000; //по умолчанию значение порта 2000

app.listen(PORT, () => { //слушаем нужный порт
  //если сервер запущен, вызывается callback ф-ия, выводящая сообщение в консоль
  console.log(`Server is running on port ${PORT}`);
})
