
function addCard (cardData, deleteCard, handleImageClick, handleLikeClick) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true); 
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  // Добавляем обработчик клика по изображению
  cardImage.addEventListener('click', () => handleImageClick(cardImage));
  // Добавляем обработчик клика по лайку
  likeButton.addEventListener('click', () => handleLikeClick(likeButton));
  
  const deleteButton = cardElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', () => deleteCard(cardElement));
  return cardElement;
};
function deleteCard(cardElement) {
  cardElement.remove();
};
// Обработчик события клика по лайку
function handleLikeClick(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}

export {handleLikeClick, addCard, deleteCard }; 


