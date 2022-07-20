import Popup from './Popup.js'

export default class PopupWithImage extends Popup {
    constructor(selector, imageModal, imageFigcaption) {
        super(selector);
        this.currentImageModal = this._popup.querySelector(imageModal);
        this.currentIimageFigcaption = this._popup.querySelector(imageFigcaption);
    }

    openPopup(title, link) {
        super.openPopup();
        this.currentImageModal.src = link;
        this.currentImageModal.alt = title;
        this.currentIimageFigcaption.textContent = title;
    }
}