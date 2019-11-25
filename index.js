const express = require('express'); //подключим пакет express
const path = require('path'); //подключим модуль для работы с путями к файлам и директориям
const csrf = require('csurf'); //подключим модуль для генерации токена
const flash = require('connect-flash'); //подключим модуль для вывода одноразовых сообщений
const mongoose = require('mongoose'); //подключим библиотеку для взаимодействия с mongoDB
const helmet = require('helmet'); //подключим модуль для дополнительной защиты приложения
const compression = require('compression'); //подключим модуль для сжатия статических файлов
const exphbs = require('express-handlebars'); //поключим шаблонизатор handlebars
const session = require('express-session'); //подключим пакет, отвечающий за сессии
const MongoStore = require('connect-mongodb-session')(session); //подключим класс session MongoStore
const homeRoutes = require('./routes/home'); //подключим обработчик маршрута /home
const cardRoutes = require('./routes/card'); //подключим обработчик маршрута /card
const addRoutes = require('./routes/add'); //подключим обработчик маршрута /add
const ordersRoutes = require('./routes/orders'); //подключим обработчик маршрута /orders
const coursesRoutes = require('./routes/courses'); //подключим обработчик маршрута /courses
const authRoutes = require('./routes/auth'); //подключим обработчик маршрута /auth
const profileRoutes = require('./routes/profile'); //подключим обработчик маршрута /profile
const varMiddleware = require('./middleware/variables'); //подключим модуль для проверки авторизации
const userMiddleware = require('./middleware/user'); //подключим модуль для получения данных об авторизованном пользователе
const errorHandler = require('./middleware/error'); //подключим модуль для обработки 404 ошибки
const fileMiddleware = require('./middleware/file'); //подключим модуль для обработки загружаемых файлов
const keys = require('./keys'); //подключим модуль, где хранятся ключи

const PORT = process.env.PORT || 2000; //по умолчанию значение порта 2000

const app = express(); //создадим объект, представляющий приложение
//сконфигурируем handlebars
const hbs = exphbs.create({
  defaultLayout: 'main', //зададим layout по умолчанию
  extname: 'hbs', //зададим псевдоним
  helpers: require('./utils/hbs-helpers') //подключим helpers
})

//сконфигурируем объект для хранения данных о сессиях в MongoDB
const store = new MongoStore({
  collection: 'sessions', //название коллекции
  uri: keys.MONGODB_URI //url для соединения с mondoDB
})

app.engine('hbs', hbs.engine); //зарегистрируем в express движок handlebars
app.set('view engine', 'hbs'); //укажем handlebars как используемый движок представления в приложении
app.set('views', 'views'); //название папки, где будут храниться шаблоны

app.use(express.static(path.join(__dirname, 'public'))); //сделаем папку public статической
//теперь express при подгрузке страниц обращается к папке public

app.use('/images', express.static(path.join(__dirname, 'images'))); //сделаем папку images статической
app.use(express.urlencoded({extended: true})); //преобразуем входящий запрос в формат JSON
app.use(session({ //настроим конфигурацию сессии
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store
}))

app.use(fileMiddleware.single('avatar')); //загружаемые файлы будут сохраняться в поле avatar
app.use(csrf()); //зарегистрируем в приложении модуль csrf;
app.use(flash()); //зарегистрируем в приложении модуль flash
app.use(helmet()); //зарегистрируем в приложении модуль helmet
app.use(compression()); //зарегистрируем в приложении модуль compression
app.use(varMiddleware); //зарегистрируем в приложении модуль varMiddleware
app.use(userMiddleware); //зарегистрируем в приложении модуль userMiddleware

//зарегистрируем в приложении роутеры
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use(errorHandler); //подключим модуль errorHandler

//создадим функцию для подключения к БД mongoDB и запуска приложения
async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    app.listen(PORT, () => { //слушаем нужный порт
      //если сервер запущен, вызывается callback функция, выводящая сообщение в консоль
      console.log(`Server is running on port ${PORT}`);
    })
  } catch (e) { //обработка ошибок
    console.log(e); //выведет сообщение с ошибкой в консоль
  }
}

start(); //запустим приложение
