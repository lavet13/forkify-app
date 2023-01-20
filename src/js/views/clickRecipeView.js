class ClickRecipeView {
    _parentEl = document.querySelector('.search-results');
    constructor() {}

    getQuery(target) {
        const link = target.closest('.preview__link');
        if (!link) return;

        return link.getAttribute('href');
    }

    addHandlerRender(handler) {
        this._parentEl.addEventListener('click', e => {
            e.preventDefault();

            if (e.target.closest('.preview__link')) handler.call(this, e);
        });
    }
}
export default new ClickRecipeView();
