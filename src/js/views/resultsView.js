import icons from '../../img/icons.svg';
import { timeout, parseHTML, guidGenerator } from '../helpers';
import { TIMEOUT_SEC } from '../config';

class ResultsView {
    _parentEl = document.querySelector('.search-results');
    _childEl = 'results';
    _spinner = 'spinner';
    _message = 'message';
    _error = 'error';
    _errorMessage = `No such recipes to be found!`;
    _markup = ``;
    _hiddenMarkup = ``;
    _id = 'dbabfec5-dcc0-127a-24a0-22e42cbd7441';
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

        const childEl = this._parentEl.querySelector(`.${this._childEl}`);
        const messageEl = this._parentEl.querySelector(`.${this._message}`);
        const spinnerEl = this._parentEl.querySelector(`.${this._spinner}`);

        childEl && this._parentEl.removeChild(childEl);
        messageEl && this._parentEl.removeChild(messageEl);
        spinnerEl && this._parentEl.removeChild(spinnerEl);

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

        const childEl = this._parentEl.querySelector(`.${this._childEl}`);
        const messageEl = this._parentEl.querySelector(`.${this._message}`);
        const errorMessageEl = this._parentEl.querySelector(`.${this._error}`);

        childEl && this._parentEl.removeChild(childEl);
        messageEl && this._parentEl.removeChild(messageEl);
        errorMessageEl && this._parentEl.removeChild(errorMessageEl);

        this._parentEl.insertAdjacentHTML('afterbegin', markup);
    }

    async render(data) {
        try {
            this.#data = data;

            if (this.#data.length === 0) throw new Error(this._errorMessage);

            this.#generateMarkup();
            this._hiddenMarkup = this._addHiddenClass(this._markup);
            const spinner = this._parentEl.querySelector(`.${this._spinner}`);

            this._parentEl.insertAdjacentHTML('afterbegin', this._hiddenMarkup);

            await Promise.all(
                this._downloadImages(
                    Array.from(
                        this._parentEl.querySelectorAll('.preview__fig img')
                    )
                )
            );

            this._parentEl
                .querySelector(`.${this._childEl}`)
                .classList.remove('hidden');

            spinner && spinner.remove();
        } catch (err) {
            throw err;
        }
    }

    _addHiddenClass(markup) {
        const element = parseHTML(markup).querySelector(`.${this._childEl}`);
        element.classList.add('hidden');
        return element.outerHTML;
    }

    _downloadImages(images) {
        return images.map(
            image =>
                new Promise((resolve, reject) => {
                    image.addEventListener('load', () => {
                        resolve(image);
                    });

                    image.addEventListener('error', () => {
                        reject(new Error('Cannot download the image'));
                    });
                })
        );
    }

    #generateMarkup() {
        this._markup = `
            <ul class="${this._childEl}">
            ${this.#data
                .map(
                    ({ id, imageUrl, publisher, title }) =>
                        `
                    <li class="preview">
                        <a
                            class="preview__link preview__link--active"
                            href="?id=${id}"
                        >
                            <figure class="preview__fig">
                                <img src="${imageUrl}" alt="${title}" />
                            </figure>
                            <div class="preview__data">
                                <h4 class="preview__title">
                                    ${title}
                                </h4>
                                <p class="preview__publisher">
                                    ${publisher}
                                </p>
                                <div class="preview__user-generated">
                                    <svg>
                                        <use
                                            href="${icons}#icon-user"
                                        ></use>
                                    </svg>
                                </div>
                            </div>
                        </a>
                    </li>
                `
                )
                .join('')}
            </ul>
        `;
    }
}

export default new ResultsView();