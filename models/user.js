const {Schema, model} = require('mongoose'); //подключим класс Schema и функцию model из пакета mongoose

const userSchema = new Schema({
  email: {
    type: String,
    reuired : true
  },
  name: {
    type: String,
    required: true
  },
  cart: {
    //опишем элементы, которые будут входить в корзину
    items: [{
        count: {
          type: Number,
          required: true,
          default: 1
        },
        courseId: {
          type: Schema.Types.ObjectId, //тип данного элемента ObjectId
          ref: 'Course', //свяжем курс с таблицой курсов
          required: true, //не должно быть пустое
        }
    }]
  }
})

userSchema.methods.assToCart = function(course) {
  const clonedItems = [...this.cart.items];
  const idx = clonedItems.findIndex(c => {
    return c.courseId.toString() === course._id.toString();
  })

  if(idx >= 0) { //если в корзине уже есть какой-либо курс
    clonedItems[idx].count = clonedItems[idx].count + 1;
  } else {
    clonedItems.push({
      courseId: course._id,
      count: 1
    })
  }

  const newCart = {items: clonedItems};
  this.cart = newCart;
  return this.save();
}

userSchema.methods.removeFromCart = function(id) {
  let items = [...this.cart.items];
  const idx = items.findIndex(c => return c.courseId.toString() === id.toString());

  if(items[idx].count === 1) {
      items = items.filter(c => c.courseId.toString() !== id.toString());
  } else {
    items[idx].count--;
  }

  const newCart = {items: clonedItems};    this.cart = newCart;
  return this.save();
}

models.exports = model('User', userSchema;
