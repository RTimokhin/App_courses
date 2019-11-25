const {Router} = require('express'); //подключим фраймворк express
const Course = require('../models/course'); //подключим модель course
const auth = require('../middleware/auth');
const router = Router();


function mapCartItems(cart) {
  return cart.items.map(c => ({
    ...c.courseId._doc,
    id: c.courseId.id,
    count: c.count
  }))
}

//посчитаем общую сумму, находящихся в корзине курсов
function computePrice(courses) {
  return courses.reduce((total, course) => {
    return total += course.price * course.count
  }, 0);
}

router.post('/add', auth, async (req, res) => {
  const course = await Course.findById(req.body.id);  //получим id курса
  await req.user.addToCart(course);
  res.redirect('/card');  //перенаправим запрос на страницу корзины
})

//реализуем метод delete
router.delete('/remove/:id', auth, async (req, res) => {
  //передадим в метод removeFromCart id курса, который необходимо удалить
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate('cart.items.courseId').execPopulate();
  const courses = mapCartItems(user.cart);
  const cart = {
    courses: courses,
    price: computePrice(courses)
  }
  res.status(200).json(cart);
})

router.get('/', auth, async (req, res) => {
  const user = await req.user
  //добавим в текущую коллекцию содержимое курса из коллекции cart
    .populate('cart.items.courseId')
    .execPopulate()

  const courses = mapCartItems(user.cart); //сформируем массив курсов

  res.render('card', {
    title: 'Корзина',
    isCard: true,
    courses: courses,
    price: computePrice(courses)
  })
})

module.exports = router; //экспортируем данный обработчик
