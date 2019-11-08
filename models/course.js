const uuid = require('uuid/v4'); //подключим модуль для генерации уникальных идентификаторов
const fs = require('fs'); //подключим модуль для работы с файловой системой
const path = require('path'); //подключим модуль для работы с путями

//создадим модель Course
class Course {
  constructor(title, price, img) {
    this.title = title,
    this.price = price,
    this.courses = courses,
    this.id = uuid()
  }

  toJSON() {
    return {
      title: this.title,
      price: this.price,
      img: this.img,
      id: this.id
    }
  }

  async save() {
    const courses = await Course.getAll();
    courses.push(this.toJSON());

    return new Promise( (resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'courses.json'),
        JSON.stringify(courses),
        (err) => {
          if(err) {
            reject(err);
          } else {
            resolve();
        }
      }
    )
  })

  static getAll() {
    return new Promise( (resolve, reject) => {
      fs.readFile(
        path.join(__dirname, '..', 'data', 'courses.json'),
        'utf-8',
        (err, content) => {
          if(err) {
            reject(err);
          } else {
            resolve(JSON.parse(content));
          }
        }
      )
    })
  }
}

module.exports = Course;
