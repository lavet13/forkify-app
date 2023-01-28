class ClickThePagination {
    _parentEl = document.querySelector('.pagination');
    _param = 'page';

    constructor() {}

    addHandlerRender(handler) {
        this._parentEl.addEventListener('click', e => {
            e.preventDefault();

            if (e.target.closest('.btn__inline')) handler.call(this, e);
        });
    }
}

export default new ClickThePagination();
