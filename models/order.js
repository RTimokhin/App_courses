const {Schema, model} = require('mongoose');  //подключим элементы schema и model из пакета mongoose

//определим метаданные для модели
const orderSchema = new Schema({
  courses: [
    {
      course: {  //определим структуру данных для объекта course
        type: Object, //тип данных объект
        required: true //не должно быть пустым
      },
      count: { //определим структуру данных для объекта count
        type: Number, //тип данных число
        required: true //не должно быть пустым
      }
    }
  ],
  user: { //определим структуру данных для объекта user
    name: String, //тип данных строка
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', //будет использоваться в User
      required: true //не должно быть пустым
    }
  },
  date: { //определим структуру данных для объекта email
    type: Date, //тип данных дата
    default: Date.now //значение по умолчанию - текущая дата
  }
})

module.exports = model('Order', orderSchema); //экспортируем данную схему
