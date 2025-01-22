import './index.css';
import { addCard, deleteCard } from './scripts/cards.js';
import { openModal, closeModal } from './scripts/modal.js';
import { enableValidation, clearValidation, checkInputValidity } from './scripts/validation.js';
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
const newCardPopup = document.querySelector('.popup_type_new-card');
const formAddElement = newCardPopup.querySelector('.popup__form');
const placesList = document.querySelector('.places__list');
// Работа с изображениями
const imagePopup = document.querySelector('.popup_type_image');
const imagePopupImg = imagePopup.querySelector('.popup__image');
const imageCaption = imagePopup.querySelector('.popup__caption');

const profileTitleElement = document.querySelector('.profile__title');
const profileDescriptionElement = document.querySelector('.profile__description');
const profileAvatarElement = document.querySelector('.profile__image');

const config = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'button_inactive',
  inputErrorClass: 'form__input_type_error',
  errorClass: 'form__input-error_active'
};

// Обработчик события клика по изображению
function handleImageClick(image) {
  imagePopupImg.src = image.src; // Устанавливаем источник изображения
  imagePopupImg.alt = image.alt; // Добавляем альтернативное описание
  imageCaption.textContent = image.alt; // Устанавливаем подпись
  openModal(imagePopup); // Открываем модальное окно с изображением
}

// Добавляем обработчики событий для открытия модальных окон
editButton.addEventListener('click', () => {
  nameInput.value = profileTitleElement.textContent;
  jobInput.value = profileDescriptionElement.textContent;
  clearValidation(profileForm, config);
  openModal(editPopup);
});

addButton.addEventListener('click', () => {
  clearValidation(formAddElement, config);
  openModal(addPopup);
});

// Обработчик отправки формы для формы РЕДАКТИРОВАНИЯ ПРОФИЛЯ
profileForm.addEventListener('submit', function(evt) {
  evt.preventDefault(); // Отменяем стандартное поведение формы
 
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;

  // Изменяем текст кнопки на "Сохранение..."
  const saveButton = profileForm.querySelector('.popup__button');
  saveButton.textContent = 'Сохранение...';
  saveButton.disabled = true; // Отключаем кнопку

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
      // Восстанавливаем текст кнопки и состояние
      saveButton.textContent = 'Сохранить';
      saveButton.disabled = false; // Включаем кнопку
    });
});

// ДАем пользователю возможность добавлять карточки
formAddElement.addEventListener('submit', function(evt) {
  evt.preventDefault(); // Отменяем стандартное поведение формы
 
  const placeName = formAddElement.elements['place-name'].value;
  const imageLink = formAddElement.elements['link'].value;

  const addButton = formAddElement.querySelector('.popup__button');
  addButton.textContent = 'Сохранение...';
  addButton.disabled = true; // Отключаем кнопку

  addNewCard(placeName, imageLink)
    .then((newCardData) => {
      const newCard = addCard(newCardData, deleteCard, handleImageClick,
        addLike,
        deleteLike 
      );
      placesList.prepend(newCard);
      console.log('New card added:', newCardData); // Лог для отладки
      closeModal(addPopup);
      formAddElement.reset(); // Очищаем поля формы
    })
    .catch((error) => {
      console.error('Ошибка при добавлении новой карточки:', error);
    })
    .finally(() => {
      addButton.textContent = 'Сохранить';
      addButton.disabled = false; // Включаем кнопку
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

enableValidation(config);

Promise.all([getUserData(), getInitialCards()])
  .then(([userData, cards]) => {
    // Получаем ID текущего пользователя
    const currentUserId = userData._id; 

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

  // Получаем элементы для работы с обновлением аватара
const avatarPopup = document.querySelector('.popup_type_avatar');
const avatarForm = avatarPopup.querySelector('.popup__form');
const avatarInput = avatarForm.querySelector('.popup__input_type_avatar');

// Обработчик события клика по изображению профиля
profileAvatarElement.addEventListener('click', () => {
  clearValidation(avatarForm, config);
  openModal(avatarPopup);
});

// Обработчик отправки формы для обновления аватара
avatarForm.addEventListener('submit', function(evt) {
  evt.preventDefault(); // Отменяем стандартное поведение формы
  
  const avatarValue = avatarInput.value;

  if (avatarForm.checkValidity()) { // Проверяем валидность формы
    const saveButton = avatarForm.querySelector('.popup__button');
    saveButton.textContent = 'Сохранение...';
    saveButton.disabled = true; // Отключаем кнопку

    updateAvatar(avatarValue)
      .then((updatedUserData) => {
        profileAvatarElement.style.backgroundImage = `url(${updatedUserData.avatar})`; // Обновляем аватар
        closeModal(avatarPopup); // Закрываем попап
      })
      .catch((error) => {
        console.error('Ошибка при обновлении аватара:', error);
      })
      .finally(() => {
        saveButton.textContent = 'Сохранить';
        saveButton.disabled = false; // Включаем кнопку
      });
  } else {
    checkInputValidity(avatarForm, avatarInput, config.inputErrorClass, config.errorClass); // Проверяем валидность поля
  }
});

avatarInput.addEventListener('input', () => {
  checkInputValidity(avatarForm, avatarInput, config.inputErrorClass, config.errorClass);
});