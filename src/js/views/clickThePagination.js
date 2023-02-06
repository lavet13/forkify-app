class ClickThePagination {
    _parentEl = document.querySelector('.pagination');
    _param = 'page';
    _paramValue;
    _totalPageCount;

    constructor() {}

    incrementPageNumber() {
        ++this._paramValue;
    }

    decrementPageNumber() {
        --this._paramValue;
    }

    addHandlerRender(handler) {
        this._parentEl.addEventListener('click', e => {
            e.preventDefault();

            if (e.target.closest('.btn--inline')) handler.call(this, e);
        });
    }
}

export default new ClickThePagination();
