import icons from '../../img/icons.svg';

export default class RecipeView {
    constructor() {}

    renderSpinner(parentEl) {
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;

        parentEl.replaceChildren();
        parentEl.insertAdjacentHTML('afterbegin', markup);
    }

    addHandlerRender(callback) {
        ['hashchange', 'load'].forEach(ev =>
            window.addEventListener(ev, callback.bind(this))
        );
    }
}
