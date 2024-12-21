import { nameInput, jobInput} from '../index.js';
export { openModal, closeModal }; 
// Функция для открытия модального окна
function openModal(modal) {
  modal.classList.add('popup_is-opened');// Добавляем класс открытия
  document.addEventListener('keydown', handleEscClose); // Добавляем обработчик при открытии
  nameInput.value = document.querySelector('.profile__title').textContent;
  jobInput.value = document.querySelector('.profile__description').textContent; 
};
// Функция для закрытия модального окна
function closeModal(modal) {
  modal.classList.remove('popup_is-opened'); // Удаляем класс для скрытия
  document.removeEventListener('keydown', handleEscClose); // Добавляем обработчик при открытии
};
// Обработчик нажатия клавиши Esc
function handleEscClose(event) {
  if (event.key === 'Escape') { // Проверяем, что нажата клавиша Esc
      const openPopup = document.querySelector('.popup_is-opened');
      if (openPopup) {
          closeModal(openPopup); // Закрываем открытое модальное окно
      }
  }
};
// Закрытие при клике вне содержимого модального окна
document.querySelectorAll('.popup').forEach(popup => {
  popup.addEventListener('click', (event) => {
      if (event.target === popup) {
          closeModal(popup);
      }
  });
});