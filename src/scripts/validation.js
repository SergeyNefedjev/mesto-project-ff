const showError = (formElement, inputElement, errorMessage, inputErrorClass, errorClass) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(errorClass);
};

const hideError = (formElement, inputElement, inputErrorClass, errorClass) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(inputErrorClass);
  errorElement.classList.remove(errorClass);
  errorElement.textContent = '';
};

export const checkInputValidity = (formElement, inputElement, inputErrorClass, errorClass) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }
  if (!inputElement.validity.valid) {
    showError(formElement, inputElement, inputElement.validationMessage, inputErrorClass, errorClass);
  } else {
    hideError(formElement, inputElement, inputErrorClass, errorClass);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => !inputElement.validity.valid);
};

const toggleButtonState = (inputList, buttonElement, inactiveButtonClass) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(inactiveButtonClass);
    buttonElement.disabled = true; // Устанавливаем disabled
  } else {
    buttonElement.classList.remove(inactiveButtonClass);
    buttonElement.disabled = false; // Убираем disabled
  }
};

const validateAndToggleButtonState = (formElement, inputList, buttonElement, config) => {
  inputList.forEach(inputElement => {
    checkInputValidity(formElement, inputElement, config.inputErrorClass, config.errorClass);
  });
  toggleButtonState(inputList, buttonElement, config.inactiveButtonClass);
};

const setEventListeners = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  // Начальная установка состояния кнопки
  toggleButtonState(inputList, buttonElement, config.inactiveButtonClass);
  inputList.forEach(inputElement => {
    inputElement.addEventListener('input', () => {
      validateAndToggleButtonState(formElement, inputList, buttonElement, config);
    });
  });
};

const enableFormValidation = (formElement, config) => {
  formElement.addEventListener('submit', function (evt) {
    evt.preventDefault();
  });
  setEventListeners(formElement, config);
};

export const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    enableFormValidation(formElement, config);
  });
};

export const clearValidation = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  inputList.forEach((inputElement) => {
    hideError(formElement, inputElement, config.inputErrorClass, config.errorClass);
  });
  buttonElement.classList.add(config.inactiveButtonClass);
};


