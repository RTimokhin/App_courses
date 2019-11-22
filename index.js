const express = require('express'); //подключим пакет express
const path = require('path'); //подключим модуль для работы с путями
const csrf = require('csurf'); //подключим модуль для генерации токена
const flash = require('connect-flash'); //подключим модуль для вывода одноразовых сообщений
const mongoose = require('mongoose'); //подключим библиотеку для взаимодействия с mongoDB
const session = require('express-session'); //подключим пакет, отвечающий за сессии
const MongoStore = require('connect-mongodb-session')(session); //подключим класс MongoStore
const exphbs = require('express-handlebars'); //поключим шаблонизатор handlebars
const homeRoutes = require('./routes/home'); //подключим модуль маршрутизации home
const addRoutes = require('./routes/add'); //подключим модуль маршрутизации add
const cardRoutes = require('./routes/card'); //подключим модуль маршрутизации card
const ordersRoutes = require('./routes/orders'); //подключим модуль маршрутизации orders
const coursesRoutes = require('./routes/courses'); //подключим модуль маршрутизации courses
const authRoutes = require('./routes/auth'); //подключим модуль маршрутизации auth
const profileRoutes = require('./routes/profile'); //подключим модуль маршрутизации profile
const User = require('./models/user'); //подключим модель user
const varMiddleware = require('./middleware/variables'); //подключим модуль для проверки авторизации
const userMiddleware = require('./middleware/user'); //подключим модуль для получения данных об авторизованном пользователе
const errorHandler = require('./middleware/error'); //подключим модуль для обработки 404 ошибки
const keys = require('./keys'); //подключим модуль, где хранятся ключи

const app = express(); //создадим объект, представляющий приложение

//сконфигурируем handlebars
const hbs = exphbs.create({
  defaultLayout: 'main', //зададим layout по умолчанию
  extname: 'hbs', //зададим псевдоним
  helpers: require('./utils/hbs-helpers')
})

const store = new MongoStore({
  collection: 'session',
  uri: keys.MONGODB_URI
})

app.engine('hbs', hbs.engine); //зарегистрируем в express движок handlebars
app.set('view engine', 'hbs'); //укажем handlebars как используемый движок представления в приложении
app.set('views', 'views'); //название папки, где будут храниться шаблоны

app.use(express.static(path.join(__dirname, 'public'))); //сделаем папку public статической
//теперь express при подгрузке страниц с адресом / обращается к папке public

app.use(express.urlencoded({extended: true})); //преобразуем входящий запрос в формат JSON

app.use(session({ //настроим конфигурацию сессии
  secret: keys.SESSION_SECRET, //строка для шифровки данных
  resave: false,
  saveUninitialized: false,
  store
}))

app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

//зарегистрируем роутеры в приложении
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use('/error', errorHandler); //подключим модуль errorHandler

const PORT = process.env.PORT || 2000; //по умолчанию значение порта 2000

//создадим функция для подключения к БД mongoDB и запуска приложения
async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useFindAndModify: false,
      useUnifiedTopology: true,
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
