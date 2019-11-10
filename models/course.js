const uuid = require('uuid/v4'); //подключим модуль для генерации уникальных идентификаторов
const fs = require('fs'); //подключим модуль для работы с файловой системой
const path = require('path'); //подключим модуль для работы с путями

//создадим модель в виде класса Course
class Course {
  constructor(title, price, img) {
    //создадим поля с помощью приватных переменных
    this.title = title
    this.price = price
    this.img = img
    this.id = uuid()
  }

  //зададим структуру данных для файла JSON
  toJSON() {
    return {
      title: this.title,
      price: this.price,
      img: this.img,
      id: this.id
    }
  }

  static async update(course) {
    const courses = await Course.getAll(); //получим список всех курсов
    const idx = courses.findIndex(c => c.id === courses.id): //найдем курс с искомым id
    courses[ind] = course; //заменим данные искомого курса

    return new Promise( (resolve, reject) => {
      fs.readFile( //считаем данные из файла
        path.join(__dirname, '..', 'data', 'courses.json'), //путь к файлу
        'utf-8', //укажем кодировку файла
        (err, content) => {
          if(err) {
            reject(err); //если имеется ошибка, выведем её текст
          } else {
            resolve(JSON.parse(content)); //иначе, преобразуем данные из JSON в объект
          }
        }
      )
    })
  }

  //реализуем метод, который будет записывать данные в файл courses.json
  async save() {
    //передадим переменной courses данные, полученные с помощью метода getAll
    const courses = await Course.getAll();
    courses.push(this.toJSON()); //добавим массиву объект с данными
    return new Promise( (resolve, reject) => {
      fs.writeFile( //запишем данные в файл
        path.join(__dirname, '..', 'data', 'courses.json'), //путь к файлу
        //преобразуем полученные данные в формат JSON
        JSON.stringify(courses),
        (err) => {
          if(err) {
            reject(err); //если есть ошибка, выведем её
          } else {
            resolve();
          }
        }
      )
    })
  }

  //создадим статический метод модели для получения данных из файла
  static getAll() {
    return new Promise( (resolve, reject) => {
      fs.readFile( //считаем данные из файла
        path.join(__dirname, '..', 'data', 'courses.json'), //путь к файлу
        'utf-8', //укажем кодировку файла
        (err, content) => {
          if(err) {
            reject(err); //если имеется ошибка, выведем её текст
          } else {
            resolve(JSON.parse(content)); //иначе, преобразуем данные из JSON в объект
          }
        }
      )
    })
  }

  //реализуем метод для получения id
  static async getById(id) {
    const courses = await Course.getAll(); //получим список всех курсов
    return courses.find(c => c.id === id); //если id курса совпадает с искомым id, вернём его
  }
}

module.exports = Course; //экспортируем схему Course
