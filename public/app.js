const toCurrent = price => {
  return new Intl.NumberFormat('ru-RU', { //приведём сумму к формату рублей
    currency: 'rub',
    style: 'currency'
  }).format(price);
}

//у каждого элемента с классом price изменим формат представления значения
document.querySelectorAll('.price').forEach(node => {
  node.textContent = toCurrency(node.textContent);
})

const $card = document.querySelector('#card'); //получим элемент с селектором card
if($card) { //если элемент с данным селектором существует
  $card.addEventListener('click', event => { //зарегистрируем обработчик события click
    //если у элемента, по которому был совершен клик присутствует класс js-remove
    if(event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id; //получим id курса, который был удален из корзины

      //создадим метод fetch
      fetch('/card/remove' + id, { //укажем путь, по которому будет совершен запрос
        method: 'delete' //http метод delete
      }).then(res => res.json()) //вернём ответ в формате JSON
        .then(card => {
          if(card.courses.length) {
            const html = ard.courses.map(c => {
            return `
            <tr>
              <td>${c.title}</td>
              <td>${c.count}</td>
              <!--кнопка удаления курсов из корзины-->
              <td><button class="btn btm-small js-remove" data-id="${c.id}">Удалить</button></td>
            </tr>
            `
          }).join('');
          $card.querySelector('tbody').innerHTML = html;
          $card.querySelector('.price').rextContent = toCurrency(card.price);
          } else {
            $card.innerHTML = '<p>Корзина пуста</p>'
          }
        })
      })
    }
  })
}
