import icons from '../../img/icons.svg';
import { parseHTML } from '../helpers';

export default class View {
    constructor() {}

    renderError(message) {
        const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;

        this._parentEl.replaceChildren();
        this._parentEl.insertAdjacentHTML('afterbegin', markup);
    }

    renderSpinner() {
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;

        this._parentEl.replaceChildren();
        this._parentEl.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this._defaultMessage) {
        const markup = `
            <div class="recipe">
                <div class="message">
                    <div>
                        <svg>
                            <use href="${icons}#icon-smile"></use>
                        </svg>
                    </div>
                    <p>
                        ${message}
                    </p>
                </div>
        `;

        this._parentEl.replaceChildren();
        this._parentEl.insertAdjacentHTML('afterbegin', markup);
    }

    isValidMarkup(markup) {
        if (!markup) return false;

        const parsedMarkup = parseHTML(markup).querySelector(
            `.${this._childEl}`
        );
        if (!parsedMarkup) return false;

        return true;
    }

    static addHiddenClassToMarkup(markup, childEl) {
        const parsedElement = parseHTML(markup).querySelector(`.${childEl}`);
        parsedElement.classList.add('hidden');
        return parsedElement.outerHTML;
    }

    _clear(element) {
        this._parentEl.removeChild(element);
    }

    _clearSpinner() {
        this._clear(this._parentEl.querySelector('.spinner'));
    }
}
