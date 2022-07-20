export default class FormValidator {
    constructor(formSelector, config) {
        this.formSelector = formSelector;
        this._inputList = Array.from(this.formSelector.querySelectorAll(config.inputSelector));
        this._buttonElement = this.formSelector.querySelector(config.submitButtonSelector);
        this._inactiveButtonClass = config.inactiveButtonClass;
        this._inputErrorClass = config.inputErrorClass;
        this._errorClass = config.errorClass;
    }

    _showInputError(inputElement, errorMessage) {
        const errorElement = this.formSelector.querySelector(`.${inputElement.id}-error`);
        inputElement.classList.add(this._inputErrorClass);
        errorElement.textContent = errorMessage;
        errorElement.classList.add(this._errorClass);
    };

    _hideInputError(inputElement) {
        const errorElement = this.formSelector.querySelector(`.${inputElement.id}-error`);
        inputElement.classList.remove(this._inputErrorClass);
        errorElement.classList.remove(this._errorClass);
        errorElement.textContent = '';
    };

    _checkInputValidity(inputElement) {
        if (!inputElement.validity.valid) {
            this._showInputError(inputElement, inputElement.validationMessage);
        } else {
            this._hideInputError(inputElement);
        }
    };

    _hasInvalidInput() {
        return this._inputList.some((inputElement) => {
            return !inputElement.validity.valid;
        })
    };

    _toggleButtonState() {
        if (this._hasInvalidInput()) {
          this._buttonElement.classList.add(this._inactiveButtonClass);
          this._buttonElement.setAttribute("disabled", "disabled");
        } else {
          this._buttonElement.classList.remove(this._inactiveButtonClass);
          this._buttonElement.removeAttribute("disabled", "disabled");
        }
    }

    resetValidation() {
      this._toggleButtonState();
      this._inputList.forEach((inputElement) => {
        this._hideInputError(inputElement);
      })
    }

    _setEventListeners() {
        this.formSelector.addEventListener('submit', function(evt) {
            evt.preventDefault();
        });
        this._inputList.forEach((inputElement) => {
            inputElement.addEventListener('input', () => {
                this._toggleButtonState();
                this._checkInputValidity(inputElement);
            })
        })
    };

    enableValidation() {
      this._setEventListeners();
    }

};
