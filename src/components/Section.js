export default class Section {
    constructor({ renderer }, containerSelector) {
        this._renderer = renderer;
        this._container = document.querySelector(containerSelector);
    }

    setItemList(element) {
        this._container.append(element);
    }

    addItem(element) {
        this._container.prepend(element);
    }

    renderItems(items) {
        this._renderedItems = Object.values(items);
        this._renderedItems.forEach(item => {
            this._renderer(item);
        });
    }
}
