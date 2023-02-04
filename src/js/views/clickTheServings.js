class ClickTheServings {
    _parentEl = document.querySelector('.recipe');
    servings; // getting data in recipeView

    constructor() {}

    getQuery(button) {
        if (button.querySelector('[href$="#icon-minus-circle"]')) {
            --this.servings;
        }

        if (button.querySelector('[href$="#icon-plus-circle"]'))
            ++this.servings;

        return this.servings;
    }

    addHandlerRender(handler) {
        this._parentEl.addEventListener('click', e => {
            e.preventDefault();

            e.target.closest('.btn--increase-servings') &&
                handler.call(this, e);
        });
    }
}

export default new ClickTheServings();
