class SearchView {
    _parentEl = document.querySelector('.search');

    constructor() {}

    getQuery() {
        const { result } = Object.fromEntries(
            new FormData(this._parentEl).entries()
        );

        return result;
    }

    addHandlerRender(handler) {
        this._parentEl.addEventListener('submit', e => {
            e.preventDefault();
            handler.call(this);
        });
    }
}

export default new SearchView();
