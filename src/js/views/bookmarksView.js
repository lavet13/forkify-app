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
    _newMarkup = ``;
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

    async render(data) {
        try {
            this.#data = data;

            if (!this.#setLocalStorage()) return;

            const childEl = this._parentEl.querySelectorAll(
                `.${this._childEl}`
            );

            childEl.length !== 0 && childEl.forEach(child => child.remove());

            this.renderSpinner();

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

    async renderFromLocalStorage() {
        try {
            const recipes = JSON.parse(localStorage.getItem('recipes'));

            if (!Array.isArray(recipes) || !(recipes.length !== 0)) {
                return;
            }

            this.renderSpinner();

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
            console.error(err);
            this.renderError(err);
        }
    }

    _addHiddenClass(markup) {
        const element = parseHTML(markup).querySelector(`.${this._childEl}`);
        element.classList.add('hidden');
        return element.outerHTML;
    }

    #setLocalStorage() {
        const { id, imageUrl, title, publisher } = this.#data;

        if (!localStorage.getItem('recipes')) {
            const recipes = [{ id, imageUrl, title, publisher }];
            localStorage.setItem('recipes', JSON.stringify(recipes));
            return true;
        }

        if (localStorage.getItem('recipes')) {
            const recipes = JSON.parse(localStorage.getItem('recipes'));

            if (!recipes.some(({ id: idRecipe }) => idRecipe === id)) {
                recipes.push({ id, imageUrl, title, publisher });
                localStorage.setItem('recipes', JSON.stringify(recipes));
                return true;
            }

            return false;
        }
    }

    #generateMarkup() {
        const recipes = JSON.parse(localStorage.getItem('recipes'));

        return `
            <ul class="${this._childEl}">
                ${recipes
                    .map(
                        ({ id, imageUrl, title, publisher }) => `
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
