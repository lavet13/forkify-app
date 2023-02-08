import icons from '../../img/icons.svg';
import { parseHTML } from '../helpers';

export default class View {
    _spinner = 'spinner';
    _message = 'message';
    _error = 'error';
    _markup = ``;
    _newMarkup = ``;
    _hiddenMarkup = ``;

    constructor() {}

    getData() {
        return this._data;
    }

    renderMessage(message = this._messageText) {
        const markup = `
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

        const childEl = this._parentEl.querySelectorAll(`.${this._childEl}`);
        const errorEl = this._parentEl.querySelectorAll(`.${this._error}`);
        const spinnerEl = this._parentEl.querySelectorAll(`.${this._spinner}`);

        if (childEl.length !== 0) childEl.forEach(child => child.remove());
        if (errorEl.length !== 0) errorEl.forEach(child => child.remove());
        if (spinnerEl.length !== 0) spinnerEl.forEach(child => child.remove());

        this._parentEl.insertAdjacentHTML('afterbegin', markup);
    }

    renderError(message = this._errorMessage) {
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

        const childEl = this._parentEl.querySelectorAll(`.${this._childEl}`);
        const messageEl = this._parentEl.querySelectorAll(`.${this._message}`);
        const spinnerEl = this._parentEl.querySelectorAll(`.${this._spinner}`);

        if (childEl.length !== 0) childEl.forEach(child => child.remove());
        if (messageEl.length !== 0) messageEl.forEach(child => child.remove());
        if (spinnerEl.length !== 0) spinnerEl.forEach(child => child.remove());

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

        const childEl = this._parentEl.querySelectorAll(`.${this._childEl}`);
        const messageEl = this._parentEl.querySelectorAll(`.${this._message}`);
        const errorMessageEl = this._parentEl.querySelectorAll(
            `.${this._error}`
        );

        if (childEl.length !== 0) childEl.forEach(child => child.remove());
        if (messageEl.length !== 0) messageEl.forEach(child => child.remove());
        if (errorMessageEl.length !== 0)
            errorMessageEl.forEach(child => child.remove());

        this._parentEl.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {
        this._data = data;
        this._newMarkup = this._generateMarkup();

        const newDom = Array.from(
            document
                .createRange()
                .createContextualFragment(this._newMarkup)
                .querySelectorAll('*')
        );

        const curElements = this._parentEl.querySelectorAll('*');

        newDom.forEach((newEl, i) => {
            const curEl = curElements[i];

            if (
                !newEl.isEqualNode(curEl) &&
                newEl.firstChild?.nodeValue.trim() !== ''
            ) {
                curEl.textContent = newEl.textContent;
            }

            if (!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach(attr =>
                    curEl.setAttribute(attr.name, attr.value)
                );
            }
        });
    }

    _addHiddenClass(markup) {
        const element = parseHTML(markup).querySelector(`.${this._childEl}`);
        element.classList.add('hidden');
        return element.outerHTML;
    }
}
