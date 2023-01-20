import View from './View';

import icons from '../../img/icons.svg';

class RecipesView extends View {
    _parentEl = document.querySelector('.search-results');
    _childEl = `results`;
    _paramSearch = 'search';
    _errorMessage = `No recipes found for your query! Please try again 💀`;
    #data;

    constructor() {
        super();
    }

    addHandlerRender(handler) {
        window.addEventListener('popstate', handler.bind(this));
    }

    async render(data) {
        try {
            this.#data = data;
            const { recipes } = this.#data;
            if (Array.isArray(recipes) && recipes.length === 0)
                throw new Error(this._errorMessage);

            const markup = this.#generateMarkup();
            this._parentEl.insertAdjacentHTML('beforeend', markup);

            const images = [
                ...this._parentEl.querySelectorAll('.preview__fig img'),
            ];

            await Promise.all(this.#downloadImages(images));

            this._parentEl
                .querySelector(`.${this._childEl}`)
                .classList.remove('hidden');

            this._parentEl.querySelector('.spinner') && this._clearSpinner();
        } catch (err) {
            throw err;
        }
    }

    #generateMarkup() {
        const { recipes, results } = this.#data;

        return `<ul class="${this._childEl} hidden">${recipes
            .map(
                ({ id, imageUrl, publisher, title }) =>
                    `
                <li class="preview">
                    <a
                        class="preview__link preview__link--active"
                        href="${id}"
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
            .join('')}</ul>`;
    }

    async renderOnHistoryNavigation(markup) {
        try {
            this._parentEl.insertAdjacentHTML('beforeend', markup);

            const images = [
                ...this._parentEl.querySelectorAll('.preview__fig img'),
            ];
            const downloadedImages = await Promise.all(
                this.#downloadImages(images)
            );

            this._parentEl
                .querySelector(`.${this._childEl}`)
                .classList.remove('hidden');
            this._parentEl.querySelector('.spinner') && this._clearSpinner();

            if (
                Array.isArray(downloadedImages) &&
                downloadedImages.length === 0
            )
                throw new Error(this._errorMessage);
        } catch (err) {
            throw err;
        }
    }

    #downloadImages(images) {
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

export default new RecipesView();
