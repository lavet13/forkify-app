class SearchView {
    _parentEl = document.querySelector('.search');
    _param = 'search';

    constructor() {}

    getQuery() {
        const { query } = Object.fromEntries(
            new FormData(this._parentEl).entries()
        );

        return query;
    }

    addHandlerRender(handler) {
        this._parentEl.addEventListener('submit', e => {
            e.preventDefault();

            handler.call(this, e);
        });
    }
}

export default new SearchView();
