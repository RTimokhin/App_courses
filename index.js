const express = require('express'); //подключим пакет express
const path = require('path'); //подключим модуль для работы с путями
const mongoose = require('mongoose'); //подключим библиотеку для взаимодействия с mongoDB
const session = require('express-session'); //подключим пакет, отвечающий за сессии
const exphbs = require('express-handlebars'); //поключим шаблонизатор handlebars
const homeRoutes = require('./routes/home'); //подключим модуль маршрутизации home из папки routes
const addRoutes = require('./routes/add'); //подключим модуль маршрутизации add из папки routes
const cardRoutes = require('./routes/card'); //подключим модуль маршрутизации card из папки routes
const ordersRoutes = require('./routes/orders'); //подключим модуль маршрутизации orders из папки routes
const coursesRoutes = require('./routes/courses'); //подключим модуль маршрутизации courses из папки routes
const authRoutes = require('./routes/auth'); //подключим модуль маршрутизации auth из папки routes
const User = require('./models/user'); //подключим модель user
const varMiddleware = require('./middleware/variables'); //подключим модуль для проверки авторизации

const app = express(); //создадим объект, представляющий приложение

//сконфигурируем handlebars
const hbs = exphbs.create({
  defaultLayout: 'main', //зададим layout по умолчанию
  extname: 'hbs' //зададим псевдоним
})

app.engine('hbs', hbs.engine); //зарегистрируем в express движок handlebars
app.set('view engine', 'hbs'); //укажем handlebars как используемый движок представления в приложении
app.set('views', 'views'); //название папки, где будут храниться шаблоны

app.use(async (req, res, next) => {
  try {
    //найдем все записи с искомым id
    const user = await User.findById('5dd1767bb409491ed489e9fc');
    req.user = user;
    next(); //передадим управление следующему middleware
  } catch(err) {
    console.log(err);
  }
})

app.use(express.static(path.join(__dirname, 'public'))); //сделаем папку public статической
//теперь express при подгрузке страниц с адресом / обращается к папке public

app.use(express.urlencoded({extended: true})); //преобразуем входящий запрос в формат JSON

app.use(session({ //настроим конфигурацию сессии
  secret: 'some secret value', //строка для шифровки данных
  resalve: false,
  saveUnitialized: false
}))
app.use(varMiddleware); //включим проверку авторизации

//зарегистрируем роутеры в приложении
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 2000; //по умолчанию значение порта 2000

//создадим функция для подключения к БД mongoDB и запуска приложения
async function start() {
  try {
    const url = 'mongodb+srv://sygo88:web456258$@cluster0-h7mvl.mongodb.net/shop'; //url для соединения с mondoDB
    await mongoose.connect(url, {
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    const candidate = await User.findOne(); //проверим существует ли данный пользователь
    if(!candidate) { //если нет, создадим его
      const user = new User({
        email: 'test@email.com',
        name: 'anonymous',
        cart: {items: []} //по умолчанию корзина - пустой объект, с пустым массивом
      })
      await user.save(); //сохраним данные
    }
    app.listen(PORT, () => { //слушаем нужный порт
      //если сервер запущен, вызывается callback ф-ия, выводящая сообщение в консоль
      console.log(`Server is running on port ${PORT}`);
    })
  } catch(err) {
    console.log(err);
  }
}
start(); //запустим приложение
