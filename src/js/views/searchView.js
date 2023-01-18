class SearchView {
    #parentEl = document.querySelector('.search');

    constructor() {}

    getQuery() {
        const { result } = Object.fromEntries(
            new FormData(this.#parentEl).entries()
        );
        return result;
    }

    addHandlerSearch(handler) {
        this.#parentEl.addEventListener('submit', function (e) {
            e.preventDefault();
            handler.call(this, e);
        });
    }
}
