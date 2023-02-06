import icons from '../../img/icons.svg';

class ClickTheServings {
    _parentEl = document.querySelector('.recipe');
    paramValue;

    constructor() {}

    addHandlerRender(handler) {
        this._parentEl.addEventListener('click', e => {
            e.preventDefault();

            const btn = e.target.closest('.btn--increase-servings');
            if (!btn) return;

            if (btn.querySelector(`[href="${icons}#icon-plus-circle"]`)) {
                handler.call(this, this.paramValue + 1);
                return;
            }

            if (btn.querySelector(`[href="${icons}#icon-minus-circle"]`))
                handler.call(
                    this,
                    this.paramValue - 1 < 1
                        ? this.paramValue
                        : this.paramValue - 1
                );
        });
    }
}

export default new ClickTheServings();
