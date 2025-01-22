import { deleteCardFromServer } from './api.js';
import { closeModal } from './modal.js'

function addCard(cardData, deleteCard, handleImageClick, addLikeFunc, deleteLikeFunc, currentUserId) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likesCount = cardElement.querySelector('.card__likes-count');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  // Устанавливаем данные карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likesCount.textContent = cardData.likes.length;

  // Проверяем, является ли текущий пользователь владельцем карточки
  if (cardData.owner._id === currentUserId) {
    deleteButton.style.display = 'block'; // Показываем кнопку удаления
    deleteButton.addEventListener('click', () => {
      openDeleteConfirmation(cardData._id, cardElement);
    });
  } else {
    deleteButton.style.display = 'none'; // Скрываем кнопку удаления
  }

  // Проверяем, есть ли у текущего пользователя лайк на этой карточке
  const userId = localStorage.getItem('userId');; // Замените на реальный ID пользователя
  let isLiked = cardData.likes.some(user => user._id === userId);

  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active'); // Добавляем класс для активного лайка
  }

  // Добавляем обработчик клика по изображению
  cardImage.addEventListener('click', () => handleImageClick(cardImage));

  // Обработчик клика по кнопке лайка
  likeButton.addEventListener('click', () => {
    handleLikeClick(cardData._id, isLiked, likesCount, likeButton, addLikeFunc, deleteLikeFunc);
    isLiked = !isLiked; // Переключаем состояние лайка после обработки
    updateLocalStorage(cardData._id, isLiked); // Обновляем localStorage
  });
  return cardElement;
}

function openDeleteConfirmation(cardId, cardElement) {
  const confirmationPopup = document.querySelector('.popup_type_confirmation');
  
  confirmationPopup.classList.add('popup_is-opened'); // Открываем попап подтверждения
  const confirmButton = confirmationPopup.querySelector('.popup__button');

  // Обработчик нажатия на кнопку "Да"
  confirmButton.onclick = () => {
    deleteCardFromServer(cardId)
      .then(() => {
        closeModal(confirmationPopup);
        cardElement.remove(); // Удаляем элемент карточки из DOM
      })
      .catch(error => console.error('Ошибка при удалении карточки:', error));
  };
}

function updateLocalStorage(cardId, isLiked) {
  let likedCards = JSON.parse(localStorage.getItem('likedCards')) || {};
  
  if (isLiked) {
    likedCards[cardId] = true; // Сохраняем состояние лайка
  } else {
    delete likedCards[cardId]; // Удаляем состояние лайка
  }
  
  localStorage.setItem('likedCards', JSON.stringify(likedCards)); // Обновляем localStorage
}

function handleLikeClick(cardId, isLiked, likesCount, likeButton, addLikeFunc, deleteLikeFunc) {
  if (isLiked) {
    deleteLikeFunc(cardId).then(updatedCard => {
       likesCount.textContent = updatedCard.likes.length; // Обновляем количество лайков
       likeButton.classList.remove('card__like-button_is-active'); // Убираем активный класс
    }).catch(error => console.error('Ошибка при снятии лайка:', error));
  } else {
    addLikeFunc(cardId).then(updatedCard => {
       likesCount.textContent = updatedCard.likes.length; // Обновляем количество лайков
       likeButton.classList.add('card__like-button_is-active'); // Добавляем активный класс
    }).catch(error => console.error('Ошибка при постановке лайка:', error));
  }
}

function deleteCard(cardElement) {
  cardElement.remove();
};

export { addCard, deleteCard};