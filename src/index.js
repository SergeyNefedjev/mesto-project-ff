import './index.css';
import { initialCards, handleLikeClick, addCard, deleteCard } from './scripts/cards.js';
import { openModal, closeModal } from './scripts/modal.js';
export { nameInput, jobInput };

// Получаем все кнопки открытия и закрытия
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const closeButtons = document.querySelectorAll('.popup__close');
// Получаем сами модальные окна
const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');
// Получаем элементы для работы с редактированием
const formElement = editPopup.querySelector('.popup__form');
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');
// ДАем пользователю возможность добавлять карточки
const newCardPopup = document.querySelector('.popup_type_new-card');
const formAddElement = newCardPopup.querySelector('.popup__form');
const placesList = document.querySelector('.places__list');

function renderCard() {
  const placesList = document.querySelector('.places__list');
  initialCards.forEach((cardData) => {
    const card = addCard(cardData, deleteCard, handleImageClick, handleLikeClick);
    placesList.append(card); 
  })
}; 
renderCard();
// Обработчик события клика по изображению
function handleImageClick(image) {
  const imagePopup = document.querySelector('.popup_type_image');
  const imagePopupImg = imagePopup.querySelector('.popup__image');
  const imageCaption = imagePopup.querySelector('.popup__caption');
  imagePopupImg.src = image.src; // Устанавливаем источник изображения
  imageCaption.textContent = image.alt; // Устанавливаем подпись
  openModal(imagePopup); // Открываем модальное окно с изображением
}
// Добавляем обработчики событий для открытия модальных окон
editButton.addEventListener('click', () => openModal(editPopup));
addButton.addEventListener('click', () => openModal(addPopup));
// Обработчик отправки формы для формы РЕДАКТИРОВАНИЯ ПРОФИЛЯ
formElement.addEventListener('submit', function(evt) {
  evt.preventDefault(); // Отменяем стандартное поведение формы
  // Получаем значения из полей ввода
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;
  // Обновляем значения на странице
  document.querySelector('.profile__title').textContent = nameValue;
  document.querySelector('.profile__description').textContent = jobValue;
  closeModal(editPopup); // Закрываем попап
});
// ДАем пользователю возможность добавлять карточки
formAddElement.addEventListener('submit', function(evt) {
  evt.preventDefault(); // Отменяем стандартное поведение формы
  // Получаем значения из полей ввода
  const placeName = formAddElement.elements['place-name'].value;
  const imageLink = formAddElement.elements['link'].value;
  // Создаем новую карточку и добавляем её в начало списка
  const newCardData = { name: placeName, link: imageLink };
  const newCard = addCard(newCardData, deleteCard, handleImageClick, handleLikeClick);
 // Добавляем новую карточку в начало списка
  placesList.prepend(newCard);
 // Закрываем попап и очищаем форму
  closeModal(addPopup);
  formAddElement.reset(); // Очищаем поля формы
});
// Добавляем обработчики событий для закрытия модальных окон
closeButtons.forEach(button => {
  button.addEventListener('click', () => {
      const popup = button.closest('.popup');
      closeModal(popup);
  });
});


