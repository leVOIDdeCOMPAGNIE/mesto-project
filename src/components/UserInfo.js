export default class UserInfo {
    constructor(profileTitle, profileDescription, profileAvatar) {
        this._profileTitle = profileTitle;
        this.profileDescription = profileDescription;
        this.profileAvatar = profileAvatar
    }

    setUserInfo(profile) {
        this._id = profile._id;
        this._name = profile.name;
        this._about = profile.about;
        this._avatar = profile.avatar
        this._profileTitle.textContent = this._name;
        this.profileDescription.textContent = this._about;
        this.profileAvatar.src = this._avatar;
    }

    getUserInfo() {
        const data = {
            title: this._profileTitle.textContent,
            description: this.profileDescription.textContent
        }
        return data
    }

    getUserId(profile) {
        this._id = profile._id;
        return this._id
    }
}
