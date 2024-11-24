// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу
// const container = document.querySelector('.content');
function renderCard() {
  initialCards.forEach(({name,link}) => {
    const card = addCard({name,link}, deleteCard);
  })
}

function addCard ({name, link}, deleteCard) {
  const placesList = document.querySelector('.places__list');
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  const deleteButton = cardElement.querySelector('.card__delete-button');

  deleteButton.addEventListener('click', deleteCard);

  cardElement.querySelector('.card__image').src = link;
  cardElement.querySelector('.card__title').textContent = name;
  
  placesList.append(cardElement); 
}

function deleteCard(){
  const cardDelete = document.querySelector('.places__item');
  cardDelete.remove();
}

renderCard();

// const cardTemplate = document.querySelector('#card-template').content;
// const cardsAdded = document.querySelector('.cards-added');

// // клонируем содержимое тега template
// const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

// // наполняем содержимым
// cardElement.querySelector('.card__image').src = 'tinyurl.com/v4pfzwy';
// cardElement.querySelector('.card__title').textContent = 'Дюк Корморант';

// // отображаем на странице
// cardsAdded.append(cardElement); 
