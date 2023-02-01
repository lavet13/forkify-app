import icons from '../../img/icons.svg';
import { parseHTML } from '../helpers';

class BookmarksView {
    _parentEl = document.querySelector('.bookmarks');
    _childEl = `bookmarks__list`;
    _spinner = 'spinner';
    _message = 'message';
    _error = 'error';
    _errorMessage = `recipe 😐`;
    _markup = ``;
    _hiddenMarkup = ``;
    #data;

    constructor() {}

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

    render(data) {
        this.#data = data;

        this.#generateMarkup();
        this._hiddenMarkup = this._addHiddenClass(this._markup);
        const spinner = this._parentEl.querySelectorAll(`.${this._spinner}`);
        this._parentEl.insertAdjacentHTML('afterbegin', this._hiddenMarkup);

        this._parentEl
            .querySelector(`.${this._childEl}`)
            .classList.remove('hidden');

        if (spinner.length !== 0) spinner.forEach(child => child.remove());
    }

    _addHiddenClass(markup) {
        const element = parseHTML(markup).querySelector(`.${this._childEl}`);
        element.classList.add('hidden');
        return element.outerHTML;
    }

    #generateMarkup() {
        const { id, imageUrl, title, publisher } = this.#data;

        this._markup = `
            <ul class="${this._childEl}">
                <li class="preview">
                    <a class="preview__link" href="?id=${id}">
                        <figure class="preview__fig">
                            <img src="${imageUrl}" alt="${title}" />
                        </figure>
                        <div class="preview__data">
                            <h4 class="preview__name">
                                ${title}
                            </h4>
                            <p class="preview__publisher">${publisher}</p>
                        </div>
                    </a>
                </li>
            </ul>
        `;
    }
}

export default new BookmarksView();
