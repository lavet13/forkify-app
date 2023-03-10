class clickTheBookmarkBtn {
    _parentEl = document.querySelector('.recipe');

    constructor() {}

    addHandlerRender(handler) {
        this._parentEl.addEventListener('click', e => {
            e.preventDefault();

            const btn = e.target.closest('.btn--round');
            if (!btn) return;

            handler.call(this, btn);
        });
    }
}

export default new clickTheBookmarkBtn();
