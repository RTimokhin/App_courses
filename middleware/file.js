const multer = require('multer'); //подключим модуль для работы с файлами

//создадим функцию для переименования и сохранения загружаемого файла
const storage = multer.diskStorage({
  destination(req, file, cb) { //определим путь куда будет сохранять файлы
    cb(null, 'images');
  },
  filename(req, file, cb) { //опеределим название для файла
    //имя будет состоять из оригинального названия файла плюс текуща дата
    //и представлено в строковом формате ISO
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

//создадим массив из разрешенных форматов загружаемых файлов
const allowedTypes = ['images/png', 'images/jpg', 'images/jpeg'];

//создадим функцию для фильтрации загружаемых на сервер файлов
const fileFilter = (req, res, cb) => {
  //если формат файла содержится в массиве разрешенных форматов
  if(allowedTypes.includes(file.mimetype)) {
    cb(null, true); //передадим значение true
  } else {
    cb(null, false); //иначе, false
  }
}

module.exports = multer({
  storage: storage,
  fileFilter: fileFilter
})
