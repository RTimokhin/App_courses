//подключим сущности Schema, model из библиотеки mongoose для взаимодействия с БД mongoDB
const {Schema, model} = require('mongoose');

//создадим новую схему данных для описания свойств модели
const courseSchema = new Schema({
  title: { //название курса
    type: String, //тип данных строка
    required: true //поле обязательное для создания модели
  },
  price: { //цена курса
    type: Number, //тип данных число
    required: true //поле обязательное для создания модели
  },
  img: String, //строковый тип данных
  userId: {
    type: Schema.Types.ObjectId, //??
    ref: 'User' //??
  }
})

//??
courseSchema.method('toClient', function() {
  const course = this.toObject(); //??

  course.id = course._id; //??
  delete course._id; //удалим id курса

  return course; //вернем курс
})

module.exports = model('Course', courseSchema); //создадим и экспортируем модель Course на основе схемы course
