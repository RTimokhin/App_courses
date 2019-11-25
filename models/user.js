//подключим элементы Schema, model из библиотеки mongoose для взаимодействия с БД mongoDB
const {Schema, model} = require('mongoose');

//создадим новую схему данных для коллекции user
const userSchema = new Schema({
  email: { //определим структуру данных для объекта email
    type: String, //тип данных строка
    required: true //поле не должно быть пустым
  },
  name: String, //определим структуру данных для объекта name
  password: { //определим структуру данных для объекта password
    type: String, //тип данных строка
    required: true  //поле не должно быть пустым
  },
  avatarUrl: String,
  resetToken: String,
  resetTokenExp: Date,
  cart: { //определим структуру данных для объекта cart
    items: [ //опишем элементы, которые будут входить в корзину
      {
        count: { //определим структуру данных для объекта count
          type: Number, //тип данных число
          required: true, //поле не должно быть пустым
          default: 1 //значение по умолчанию равно 1
        },
        courseId: { //определим структуру данных для объекта courseId
          type: Schema.Types.ObjectId, //тип данного элемента ObjectId
          ref: 'Course', //свяжем курс с таблицой курсов
          required: true //поле не должно быть пустым
        }
      }
    ]
  }
})

//создадим метод для добавления курса в корзину
userSchema.methods.addToCart = function(course) {
  const items = [...this.cart.items]; //получим список всех находящихся в корзине курсов
  //найдем индекс нужного курса
  const idx = items.findIndex(c => {
    return c.courseId.toString() === course._id.toString();
  })

  if (idx >= 0) { //если такой курс найден
     //увеличим количество данного курса в корзине на 1
    items[idx].count = items[idx].count + 1;
  } else {
    items.push({ //иначе, добавим его в корзину
      courseId: course._id,
      count: 1
    })
  }

  //сохраним данные
  this.cart = {items};
  return this.save();
}

//создадим метод удаления курса из корзины
userSchema.methods.removeFromCart = function(id) {
  let items = [...this.cart.items];  //получим список всех находящихся в корзине курсов
  //найдем индекс нужного курса
  const idx = items.findIndex(c => c.courseId.toString() === id.toString());

  if (items[idx].count === 1) { //если количество данного курса в корзине равно 1
    //удалим с помощью фильтра данный курс из корзины
    items = items.filter(c => c.courseId.toString() !== id.toString());
  } else {
    items[idx].count--; //иначе, уменьшим количество данного курса в корзине на 1
  }

  //сохраним данные
  this.cart = {items};
  return this.save();
}

//создадим метод для очистки корзины
userSchema.methods.clearCart = function() {
  this.cart = {items: []};  //очистим массив с курсами
  return this.save(); //сохраним изменения
}

module.exports = model('User', userSchema); //экспортируем модель User
