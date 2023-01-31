class clickTheBookmarkBtn {
    _parentEl = document.querySelector('.recipe');

    constructor() {}

    addHandlerRender(handler) {
        this._parentEl.addEventListener('click', e => {
            e.preventDefault();

            if (e.target.closest('.recipe__details button.btn--round'))
                handler.call(this, e);
        });
    }
}

export default new clickTheBookmarkBtn();
