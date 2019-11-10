//у каждого элемента с классом price изменим формат представления значения
document.querySelectorAll('.price').forEach(node => {
  node.textContent = new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency'
  }).format(node.textContent)
})
