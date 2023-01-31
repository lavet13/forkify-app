class ClickTheServings {
    _parentEl = document.querySelector('.recipe');

    constructor() {}

    addHandlerRender(handler) {
        this._parentEl.addEventListener('click', e => {
            e.preventDefault();

            if (e.target.closest('.btn--increase-servings'))
                handler.call(this, e);
        });
    }
}

export default new ClickTheServings();
