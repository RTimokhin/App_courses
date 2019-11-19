const {Router} = require('express'); //подключим объект Router из фраймворка express;
const Order = require('../models/order'); //подключим модель order;
const auth = require('../middleware/auth');
const router = Router();

//напишем обработчик для запроса get
router.get('/', auth, async (req, res) => {
  try {
    //получим список всех заказов, относящихся к нужному пользователю
    const orders = await Order.find({'user.userId': req.user._id})
      .populate('user.userId');
    res.render('orders', { //отобразим страницу order
      isOrder: true, //установим флаг isOrder в значение true
      title: 'Заказы', //зададим заголовок страницы
      orders: orders.map(o => { //объект заказы
        return {
          ...o._doc,
          price: o.courses.reduce( (total, c) => { //посчитаем сумму заказа
            return total += c.count * c.couse.price
          }, 0)
        }
      })
    })
  } catch(err) {
    console.log(err);
  }
})

router.post('/', auth, async (req, res) => {
  try {
    //получим все данные, которые находятся в корзине
    const user = await req.user //и добавим их в объект user
      .populate('cart.items.courseId')
      .execPopulate();
    //создадим объект курсов и приведем его к следующему формату
    const courses = user.cart.items.map(i => ({
      count: i.count,
      course: {...i.courseId._doc}
    }))

    //создадим объект order со соледующими параметрами
    const order = new Order({
      user: { //объект user
        name: req.user.name,
        userId: req.user
      },
      courses: courses //объект course
    })

    await order.save(); //дождемся пока создатся новый заказ
    await req.user.clearCart(); //после очистим корзину

    res.redirect('/orders'); //перенаправим запрос

  } catch(err) {
    console.log(err);
  }
})

module.exports = router; //экспортируем данный роутер
