const express = require('express'); //подключим пакет express
const path = require('path'); //подключим модуль для работы с путями
const mongoose = require('mongoose'); //подключим библиотеку для взаимодействия с mongoDB
const exphbs = require('express-handlebars'); //поключим шаблонизатор handlebars
const homeRoutes = require('./routes/home'); //подключим модуль маршрутизации home из папки routes
const addRoutes = require('./routes/add'); //подключим модуль маршрутизации add из папки routes
const cardRoutes = require('./routes/card'); //подключим модуль маршрутизации card из папки routes
const coursesRoutes = require('./routes/courses'); //подключим модуль маршрутизации courses из папки routes
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

app.use(express.static(path.join(__dirname, 'public'))); //сделаем папку public статической
//теперь express при подгрузке страниц с адресом / обращается к папке public

app.use(express.urlencoded({extended: true})); //преобразуем входящий запрос в формат JSON

//зарегистрируем роутеры в приложении
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);

const PORT = process.env.PORT || 2000; //по умолчанию значение порта 2000

//создадим функция для подключения к БД mongoDB и запуска приложения
async function start() {
  try {
    const url = 'mongodb+srv://sygo88:web456258$@cluster0-h7mvl.mongodb.net/shop'; //url для соединения с mondoDB
    await mongoose.connect(url, {
      useFindAndModify: false,
      useNewUrlParser: true
    })
    app.listen(PORT, () => { //слушаем нужный порт
      //если сервер запущен, вызывается callback ф-ия, выводящая сообщение в консоль
      console.log(`Server is running on port ${PORT}`);
    })
  } catch(err) {
    console.log(err);
  }
}
start(); //запустим приложение
