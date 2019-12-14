//напишем функцию для перевода отображения суммы в языко-зависимый формат
const toCurrency = price => {
  //создадим объект для языко-зависимого форматирования чисел
  return new Intl.NumberFormat('ru-RU', {
    currency: 'rub', //укажем валюту, используемую для форматировании суммы
    style: 'currency' //форматирование проводится для валюты
  }).format(price); //применим форматирование
}

//напишем функцию для форматирования даты
const toDate = date => {
  //создадим объект для языко-зависимого форматирования даты
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date)); //применим форматирование
}

//для каждого элемента с селектором price изменим формат представления значения
document.querySelectorAll('.price').forEach(node => {
  node.textContent = toCurrency(node.textContent);
})

//для каждого элемента с селектором date изменим формат представления значения
document.querySelectorAll('.date').forEach(node => {
  node.textContent = toDate(node.textContent);
})

const $card = document.querySelector('#card'); //получим элемент с селектором card
if ($card) { //если элемент с данным селектором существует
  $card.addEventListener('click', event => { //зарегистрируем обработчик события click
    //если у элемента, по которому был совершен клик присутствует класс js-remove
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id; //получим id курса, который был удален из корзины
      const csrf = event.target.dataset.csrf; //получим csrf токен курса, который был удален из корзины

      //создадим метод fetch для удаления курсов из корзины
      fetch('/card/remove/' + id, { //укажем путь, по которому будет совершен запрос
        method: 'delete', //используем http метод delete
        headers: { //в headers передадим csrf токен удаляемого курса
          'X-XSRF-TOKEN': csrf
        },
      }).then(res => res.json()) //затем вернём ответ в формате JSON
        .then(card => {
          if (card.courses.length) { //если в корзине ещё остались курсы
            const html = card.courses.map(c => {
              return `
              <tr>
                <td>${c.title}</td>
                <td>${c.count}</td>
                <td>
                  <button class="btn btm-small js-remove" data-id="${c.id}">Удалить</button>
                </td>
              </tr>
              `
            }).join('');
            $card.querySelector('tbody').innerHTML = html;
            $card.querySelector('.price').textContent = toCurrency(card.price);
          } else {
            $card.innerHTML = '<p>Корзина пуста</p>';
          }
        })
    }

  })
}

M.Tabs.init(document.querySelectorAll('.tabs')); //инициализируем табы
