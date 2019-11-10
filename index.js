const express = require('express'); //импортируем пакет express
const path = require('path'); //модуль для работы с путями
const exphbs = require('express-handlebars'); //поключм шаблонизатор handlebars
const homeRoutes = require('./routes/home'); //подключим роутер для главной страницы
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const coursesRoutes = require('./routes/courses');
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

app.use(express.urlencoded({extended: true})); //преобразуем входящий запрос в формат JSON

//регистрируем роутеры в express
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);

const PORT = process.env.PORT || 2000; //по умолчанию значение порта 2000

app.listen(PORT, () => { //слушаем нужный порт
  //если сервер запущен, вызывается callback ф-ия, выводящая сообщение в консоль
  console.log(`Server is running on port ${PORT}`);
})
