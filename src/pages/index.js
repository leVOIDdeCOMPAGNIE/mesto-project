import "./index.css";
import FormValidator from "../components/FormValidator.js";
import Card from "../components/Card.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import { api } from "../components/Api.js";
import Section from "../components/Section.js";
import UserInfo from "../components/UserInfo.js";
import {
  cardSection,
  profilePopup,
  cardPopup,
  profileAvatarPopup,
  imagePopup,
  confirmDeletePopup,
  profileTitle,
  profileDescription,
  profileAvatar,
  buttonChangeProfile,
  buttonAddCard,
  buttonProfileAvatar,
  profileForm,
  addCardForm,
  profileAvatarForm,
} from "../utils/constants.js";

// /*Создание стартовых карточек и данных профиля*/
let userId = "";
let cardIdToDelete = "";
let cardTargetToDelete = "";

const userInfo = new UserInfo(profileTitle, profileDescription, profileAvatar);

const cardRender = new Section(
  {
    renderer: (item) => {
      const cardElement = card.generate(item, userId);
      cardRender.setItemList(cardElement);
    },
  },
  cardSection
);

const getInfo = Promise.all([api.getInitialCards(), api.getProfileInfo()]);
getInfo
  .then(([cards, profile]) => {
    userInfo.setUserInfo(profile);
    userId = userInfo.getUserId(profile);
    cardRender.renderItems(cards);
  })
  .catch((err) => {
    console.log(err);
  });

const card = new Card({
  selector: ".card_template",
  putLikeCardRender: (likeBtn, data) => {
    api
      .putLikeCard(data._id)
      .then((card) => {
        card.likeCard(data)
      })
      .catch((err) => {
        console.log(err);
      });
  },
  deleteLikeCardRender: (likeBtn, data) => {
    api
      .deleteLikeCard(data._id)
      .then((card) => {
        card.likeCard(data)
      })
      .catch((err) => {
        console.log(err);
      });
  },
  openImage: (title, link) => {
    popupWithImage.openPopup(title, link);
  },
  deleteCard: (cardId, cardTarget) => {
    cardIdToDelete = cardId;
    cardTargetToDelete = cardTarget;
    popupTypeConfirmDelete.openPopup();
  },
});

/*Валидация*/
const formValidators = {};

const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    const validator = new FormValidator(formElement, config);
    const formName = formElement.getAttribute("name");
    formValidators[formName] = validator;
    validator.enableValidation();
  });
};

enableValidation({
  formSelector: ".modal",
  inputSelector: ".modal__item",
  submitButtonSelector: ".modal__save-btn",
  inactiveButtonClass: "modal__save-btn_inactive",
  inputErrorClass: "modal__item_type_error",
  errorClass: "modal__item-error_active",
});

/*Попапы*/
const popupTypeProfile = new PopupWithForm({
  selector: profilePopup,
  handleSubmit: (formData) => {
    api
      .renewProfileInfo(
        formData["profile-title"],
        formData["profile-description"]
      )
      .then((profile) => {
        userInfo.setUserInfo(profile);
        popupTypeProfile.closePopup();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        popupTypeProfile.renderLoading();
      });
  },
});

popupTypeProfile.setEventListeners();

const popupTypeCardAdd = new PopupWithForm({
  selector: cardPopup,
  handleSubmit: (formData) => {
    api
      .postNewCard(formData["card-title"], formData["card-link"])
      .then((item) => {
        const cardElement = card.generate(item, userId);
        cardRender.addItem(cardElement);
        popupTypeCardAdd.closePopup();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        popupTypeCardAdd.renderLoading();
      });
  },
});
popupTypeCardAdd.setEventListeners();

const popupTypeProfileAvatar = new PopupWithForm({
  selector: profileAvatarPopup,
  handleSubmit: (formData) => {
    api
      .renewProfileAvatar(formData["profile-avatar-link"])
      .then((profile) => {
        userInfo.setUserInfo(profile);
        popupTypeProfileAvatar.closePopup();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        popupTypeProfileAvatar.renderLoading();
      });
  },
});
popupTypeProfileAvatar.setEventListeners();

const popupWithImage = new PopupWithImage(
  imagePopup,
  ".modal__image",
  ".modal__figcaption"
);
popupWithImage.setEventListeners();

const popupTypeConfirmDelete = new PopupWithForm({
  selector: confirmDeletePopup,
  handleSubmit: () => {
    api
      .deleteCardApi(cardIdToDelete)
      .then(() => {
        cardTargetToDelete.remove();
        popupTypeConfirmDelete.closePopup();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        popupTypeConfirmDelete.renderLoading("Да");
      });
  },
});
popupTypeConfirmDelete.setEventListeners();

/*Открытие окна формы Редактировать профиль*/
buttonChangeProfile.addEventListener("click", function () {
  const data = userInfo.getUserInfo();
  const inputList = profileForm.querySelectorAll(".modal__item");
  inputList[0].value = data.title;
  inputList[1].value = data.description;
  popupTypeProfile.openPopup();
  formValidators[profileForm.getAttribute("name")].resetValidation();
});

/*Открытие окна формы Добавить новое место*/
buttonAddCard.addEventListener("click", function () {
  popupTypeCardAdd.openPopup();
  formValidators[addCardForm.getAttribute("name")].resetValidation();
});

/*Открытие окна формы Изменить аватар*/
buttonProfileAvatar.addEventListener("click", function () {
  popupTypeProfileAvatar.openPopup();
  formValidators[profileAvatarForm.getAttribute("name")].resetValidation();
});
