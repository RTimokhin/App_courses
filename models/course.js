//подключим элементы Schema, model из библиотеки mongoose для взаимодействия с БД mongoDB
const {Schema, model} = require('mongoose');

//создадим новую схему данных для коллекции course
const courseSchema = new Schema({
  title: { //определим структуру данных для объекта title
    type: String, //тип данных строка
    required: true //поле обязательное для создания модели
  },
  price: { //определим структуру данных для объекта price
    type: Number, //тип данных число
    required: true //поле обязательное для создания модели
  },
  img: String, //строковый тип данных
  userId: { //определим структуру данных для объекта userId
    type: Schema.Types.ObjectId, //тип данных ObjectId
    ref: 'User' //свяжем с коллекцией user
  }
})

//определим новый метод для получения объекта курса
courseSchema.method('toClient', function() {
  const course = this.toObject();

  course.id = course._id;
  delete course._id; //удалим _id курса

  return course; //вернем курс
})

module.exports = model('Course', courseSchema); //создадим и экспортируем модель Course на основе схемы course
