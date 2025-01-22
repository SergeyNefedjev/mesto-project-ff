function openModal(modal) {
  modal.classList.add('popup_is-opened');// Добавляем класс открытия
  document.addEventListener('keydown', handleEscClose); // Добавляем обработчик при открытии
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

export { openModal, closeModal }; 