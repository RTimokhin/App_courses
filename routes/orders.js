const {Router} = require('express'); //подключим объект Router
const Order = require('../models/order'); //подключим модель order
const auth = require('../middleware/auth'); //подключим промежуточное ПО для проверки аутентификации
const router = Router(); //создадим экземпляр класса express.Router

//напишем обработчик для запроса get на страницу корзины пользователя
router.get('/', auth, async (req, res) => {
  try {
    //получим список всех заказов, относящихся к искомому пользователю
    const orders = await Order.find({'user.userId': req.user._id})
      .populate('user.userId')

    res.render('orders', { //отобразим страницу корзины пользователя
      isOrder: true, //установим флаг isOrder в значение true
      title: 'Заказы', //зададим заголовок страницы
      orders: orders.map(o => { //создадим объект заказы
        return {
          ...o._doc,
          price: o.courses.reduce((total, c) => {  //посчитаем общую сумму заказа
            return total += c.count * c.course.price
          }, 0)
        }
      })
    })
  } catch (e) {
    console.log(e); //если есть ошибки, выведем их в консоль
  }
})

//напишем обработчик для post запроса
router.post('/', auth, async (req, res) => {
  try {
    //получим все данные, которые находятся в корзине
    const user = await req.user //и добавим их в объект user
      .populate('cart.items.courseId')
      .execPopulate()

    //создадим объект курсов и приведем его к следующему формату
    const courses = user.cart.items.map(i => ({
      count: i.count,
      course: {...i.courseId._doc}
    }))

    //создадим объект order со соледующими параметрами
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user
      },
      courses: courses
    })

    await order.save();  //дождемся пока создатся новый заказ
    await req.user.clearCart();  //после очистим корзину

    res.redirect('/orders'); //перенаправим запрос
  } catch (e) {
    console.log(e);
  }
})

module.exports = router; //экспортируем данный роутер
