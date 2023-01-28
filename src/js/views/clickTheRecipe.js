class ClickTheRecipe {
    _parentEl = document.querySelector('.search-results');
    _param = 'id';

    constructor() {}

    getQuery(target) {
        const link = target.closest('.preview__link');
        if (!link) return;

        return decodeURIComponent(link.getAttribute('href').split('=')[1]);
    }

    addHandlerRender(handler) {
        this._parentEl.addEventListener('click', e => {
            e.preventDefault();

            if (e.target.closest('.preview__link')) handler.call(this, e);
        });
    }
}

export default new ClickTheRecipe();
