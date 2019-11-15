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
