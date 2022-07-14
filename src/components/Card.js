export default class Card {
    constructor({ selector, putLikeCardRender, deleteLikeCardRender, openImage, deleteCard }) {
        this._selector = selector;
        this._putLikeCardRender = putLikeCardRender;
        this._deleteLikeCardRender = deleteLikeCardRender;
        this._openImage = openImage;
        this._deleteCard = deleteCard;
    }

    _getElement() {
        const cardElement = document
            .querySelector(this._selector)
            .content
            .querySelector('.card')
            .cloneNode(true);
        return cardElement;
    }

    generate(data, userId) {
        this._title = data.name;
        this._link = data.link;
        this._likes = data.likes;
        this._cardId = data._id;
        this._cardOwnerId = data.owner._id;
        this._element = this._getElement();
        this._element.id = this._cardId;
        this._img = this._element.querySelector('.card__image');
        this._img.src = this._link;
        this._img.alt = this._title;
        this._element.querySelector('.card__title').textContent = this._title;
        this._likeBtn = this._element.querySelector('.card__btn')
        this._likeBtn.textContent = this._likes.length;
        this._deleteBtn = this._element.querySelector('.card__delete-btn');
        if (this._checkLikeCard(data, userId)) {
            this._likeBtn.classList.add('card__btn_active');
        }
        this._checkDeleteCard(data, userId)
        this._setEventListeners(data);
        return this._element;
    }

    _checkLikeCard(data, userId) {
        this._likes = data.likes;
        return Object.values(this._likes).some(like => like._id === userId)
    }


    _likeCard(likeBtn, data) {
        if (!likeBtn.classList.contains('card__btn_active')) {
            this._putLikeCardRender(likeBtn, data);
        } else {
            this._deleteLikeCardRender(likeBtn, data);
        }

    }

    _checkDeleteCard(data, userId) {
        this._likes = data.likes;
        this._cardOwnerId = data.owner._id;

        if (this._cardOwnerId === userId) {
            this._deleteBtn.style.display = 'block';
            return Object.values(this._likes).some(like => like._id === userId)
        }
    }

    _setEventListeners(data) {
        this._title = data.name;
        this._link = data.link;
        this._cardId = data._id;

        this._likeBtn.addEventListener('click', (evt) => {
            const cardTarget = evt.target.closest('.card__btn');
            this._likeCard(cardTarget, data);
        });

        this._deleteBtn.addEventListener('click', (evt) => {
            const cardTarget = evt.target.closest('.card');
            const cardID = cardTarget.id;
            this._deleteCard(cardID, cardTarget);
        });

        this._img.addEventListener('click', (evt) => {
            const cardName = evt.target.closest('.card__image').alt
            const cardLink = evt.target.closest('.card__image').src
            this._openImage(cardName, cardLink);
        });
    }
}
