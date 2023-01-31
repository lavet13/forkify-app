class ServingsView {
    _parentEl = document.querySelector('.recipe');
    _paramValue;

    constructor() {}

    increaseServings() {
        ++this._paramValue;
    }
    decreaseServings() {
        if (this._paramValue <= 1) return;
        --this._paramValue;
    }
}

export default new ServingsView();
