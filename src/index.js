import './index.css';
import { addCard, deleteCard } from './scripts/cards.js';
import { openModal, closeModal } from './scripts/modal.js';
import { enableValidation, clearValidation, toggleButtonState } from './scripts/validation.js';
import { getInitialCards, getUserData, updateUserData, addNewCard, addLike, deleteLike, updateAvatar } from './scripts/api.js';

// Получаем все кнопки открытия и закрытия
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const closeButtons = document.querySelectorAll('.popup__close');

// Получаем сами модальные окна
const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');

// Получаем элементы для работы с редактированием
const profileForm = editPopup.querySelector('.popup__form');
const nameInput = profileForm.querySelector('.popup__input_type_name');
const jobInput = profileForm.querySelector('.popup__input_type_description');

// ДАем пользователю возможность добавлять карточки
const formAddElement = addPopup.querySelector('.popup__form');
const placesList = document.querySelector('.places__list');

// Работа с изображениями
const imagePopup = document.querySelector('.popup_type_image');
const imagePopupImg = imagePopup.querySelector('.popup__image');
const imageCaption = imagePopup.querySelector('.popup__caption');
const profileTitleElement = document.querySelector('.profile__title');
const profileDescriptionElement = document.querySelector('.profile__description');
const profileAvatarElement = document.querySelector('.profile__image');

// Получаем элементы для работы с обновлением аватара
const avatarPopup = document.querySelector('.popup_type_avatar');
const avatarForm = avatarPopup.querySelector('.popup__form');
const avatarInput = avatarForm.querySelector('.popup__input_type_avatar');
let currentUserId;

const config = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'button_inactive',
  inputErrorClass: 'form__input_type_error',
  errorClass: 'form__input-error_active'
};

//Функция для изменения состояния кнопки загрузки
function renderLoading(isLoading, button) {
  if (isLoading) {
    button.textContent = 'Сохранение...';
  } else {
    button.textContent = 'Сохранить';
  }
}

// Обработчик события клика по изображению
function handleImageClick(image) {
  imagePopupImg.src = image.src; // Устанавливаем источник изображения
  imagePopupImg.alt = image.alt; // Добавляем альтернативное описание
  imageCaption.textContent = image.alt; // Устанавливаем подпись
  openModal(imagePopup); // Открываем модальное окно с изображением
}

editButton.addEventListener('click', () => {
  nameInput.value = profileTitleElement.textContent;
  jobInput.value = profileDescriptionElement.textContent;
  clearValidation(profileForm, config); // Очищаем валидацию и обновляем состояние кнопки
  openModal(editPopup);
});

addButton.addEventListener('click', () => {
  clearValidation(formAddElement, config); // Очищаем валидацию и обновляем состояние кнопки
  openModal(addPopup);
});

// Обработчик отправки формы для формы РЕДАКТИРОВАНИЯ ПРОФИЛЯ
profileForm.addEventListener('submit', function(evt) {
  evt.preventDefault(); // Отменяем стандартное поведение формы
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;
  const saveButton = profileForm.querySelector('.popup__button');
  renderLoading(true, saveButton); // Устанавливаем состояние загрузки
  updateUserData(nameValue, jobValue)
    .then((updatedUserData) => {
      profileTitleElement.textContent = updatedUserData.name;
      profileDescriptionElement.textContent = updatedUserData.about;
      profileAvatarElement.src = updatedUserData.avatar; // Если нужно обновить аватар
      closeModal(editPopup); // Закрываем попап
    })
    .catch((error) => {
      console.error('Ошибка при обновлении данных пользователя:', error);
    })
    .finally(() => {
      renderLoading(false, saveButton); // Восстанавливаем состояние кнопки
    });
});

// ДАем пользователю возможность добавлять карточки
formAddElement.addEventListener('submit', function(evt) {
  evt.preventDefault(); // Отменяем стандартное поведение формы
  const placeName = formAddElement.elements['place-name'].value;
  const imageLink = formAddElement.elements['link'].value;
  const addButton = formAddElement.querySelector('.popup__button');
  renderLoading(true, addButton); // Устанавливаем состояние загрузки
  addNewCard(placeName, imageLink)
    .then((newCardData) => {
      const newCard = addCard(newCardData, deleteCard, handleImageClick,
        addLike,
        deleteLike,
        currentUserId 
      );
      placesList.prepend(newCard);
      closeModal(addPopup);
      formAddElement.reset(); // Очищаем поля формы
    })
    .catch((error) => {
      console.error('Ошибка при добавлении новой карточки:', error);
    })
    .finally(() => {
      renderLoading(false, addButton); // Восстанавливаем состояние кнопки
    });
});

// Добавляем обработчики событий для закрытия модальных окон
closeButtons.forEach(button => {
  button.addEventListener('click', () => {
      const popup = button.closest('.popup');
      closeModal(popup);
  });
});

// Закрытие при клике вне содержимого модального окна
document.querySelectorAll('.popup').forEach(popup => {
  popup.addEventListener('click', (event) => {
      if (event.target === popup) {
          closeModal(popup);
      }
  });
});

Promise.all([getUserData(), getInitialCards()])
  .then(([userData, cards]) => {
    // Получаем ID текущего пользователя
    currentUserId = userData._id; 
    profileTitleElement.textContent = userData.name;
    profileDescriptionElement.textContent = userData.about;
    profileAvatarElement.style.backgroundImage = `url(${userData.avatar})`; 
    const likedCards = JSON.parse(localStorage.getItem('likedCards')) || {}; // Определяем likedCards
    cards.forEach((cardData) => {
      const isLiked = likedCards[cardData._id] === true; 
      const card = addCard(cardData, deleteCard, handleImageClick,
        addLike,
        deleteLike,
        currentUserId // Передаем ID пользователя
      );
      if (isLiked) { 
        card.querySelector('.card__like-button').classList.add('card__like-button_is-active'); 
      }
      placesList.append(card);
    });
  })
  .catch((error) => {
    console.error('Ошибка:', error);
  });

// Обработчик события клика по изображению профиля
profileAvatarElement.addEventListener('click', () => {
  clearValidation(avatarForm, config); // Очищаем валидацию перед открытием
  openModal(avatarPopup);
});

// Обработчик отправки формы для обновления аватара
avatarForm.addEventListener('submit', function(evt) {
  evt.preventDefault(); // Отменяем стандартное поведение формы
  const avatarValue = avatarInput.value;
   // Сначала очищаем валидацию перед отправкой
  clearValidation(avatarForm, config);
  // Проверяем валидность формы перед отправкой
  if (avatarForm.checkValidity()) { 
    const saveButton = avatarForm.querySelector('.popup__button');
    renderLoading(true, saveButton); // Устанавливаем состояние загрузки
    updateAvatar(avatarValue)
      .then((updatedUserData) => {
        profileAvatarElement.style.backgroundImage = `url(${updatedUserData.avatar})`; // Обновляем аватар
        closeModal(avatarPopup); // Закрываем попап
      })
      .catch((error) => {
        console.error('Ошибка при обновлении аватара:', error);
      })
      .finally(() => {
        renderLoading(false, saveButton); // Восстанавливаем состояние кнопки
      });
  }
});

enableValidation(config);