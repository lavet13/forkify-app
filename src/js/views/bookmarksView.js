import icons from '../../img/icons.svg';
import { parseHTML } from '../helpers';

class BookmarksView {
    _parentEl = document.querySelector('.bookmarks');
    _childEl = `bookmarks__list`;
    _spinner = 'spinner';
    _message = 'message';
    _error = 'error';
    _errorMessage = `recipe 😐`;
    _messageText = `No bookmarks yet. Find a nice recipe and bookmark it :)`;
    _markup = ``;
    _newMarkup = ``;
    _hiddenMarkup = ``;
    #data;

    constructor() {}

    renderMessage(message = this._messageText) {
        const markup = `
            <div class="message">
                <div>
                    <svg>
                        <use
                            href="${icons}#icon-smile"
                        ></use>
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

    async render(data) {
        try {
            const childEl = this._parentEl.querySelectorAll(
                `.${this._childEl}`
            );
            childEl.length !== 0 && childEl.forEach(child => child.remove());

            this.#data = data;

            const spinner = this._parentEl.querySelectorAll(
                `.${this._spinner}`
            );

            this._markup = this.#generateMarkup();
            this._hiddenMarkup = this._addHiddenClass(this._markup);
            this._parentEl.insertAdjacentHTML('beforeend', this._hiddenMarkup);

            await Promise.all(
                this._downloadImages(
                    Array.from(
                        this._parentEl.querySelectorAll(`.preview__fig img`)
                    )
                )
            );

            this._parentEl
                .querySelector(`.${this._childEl}`)
                .classList.remove('hidden');

            if (spinner.length !== 0) spinner.forEach(child => child.remove());
        } catch (err) {
            throw err;
        }
    }

    update(data) {
        this.#data = data;
        this._newMarkup = this.#generateMarkup();

        const newDom = Array.from(
            document
                .createRange()
                .createContextualFragment(this._newMarkup)
                .querySelectorAll('*')
        );

        const curElements = this._parentEl.querySelectorAll('*');

        newDom.forEach((newEl, i) => {
            const curEl = curElements[i];

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

    #generateMarkup() {
        const { searchParams } = new URL(window.location);
        const idFromURL = searchParams.get('id');

        return `
            <ul class="${this._childEl}">
                ${this.#data
                    .map(
                        ({ id, imageUrl, title, publisher }) => `
                        <li class="preview">
                            <a class="preview__link ${
                                idFromURL === id ? 'preview__link--active' : ''
                            }" href="?id=${id}">
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
                                            <use href="${icons}#icon-user"></use>
                                        </svg>
                                    </div>
                                </div>
                            </a>
                        </li>`
                    )
                    .join('')}
            </ul>
        `;
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
}

export default new BookmarksView();
