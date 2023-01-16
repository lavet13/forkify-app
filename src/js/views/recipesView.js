import icons from '../../img/icons.svg';

class RecipesView {
    #parentEl = document.querySelector('.search-results');
    #data;

    constructor() {}

    renderSpinner() {
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;

        this.#parentEl.replaceChildren();
        this.#parentEl.insertAdjacentHTML('afterbegin', markup);
    }

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

        this.#parentEl.replaceChildren();
        this.#parentEl.insertAdjacentHTML('afterbegin', markup);
    }

    async render(data) {
        try {
            this.#data = data;

            const markup = this.#generateMarkup();
            this.#parentEl.insertAdjacentHTML('beforeend', markup);

            const images = [
                ...this.#parentEl.querySelectorAll('.preview__fig img'),
            ];

            const downloadedImages = await Promise.all(
                this.#downloadImages(images)
            );
            // console.log(downloadedImages);
            this.#parentEl.querySelector('.results').classList.remove('hidden');

            this.#parentEl.querySelector('.spinner') && this.#clearSpinner();

            if (downloadedImages.length === 0)
                throw new Error(`We couldn't find any recipes`);
        } catch (err) {
            throw err;
        }
    }

    #generateMarkup() {
        const { recipes, results } = this.#data;

        return `<ul class="results hidden">${recipes
            .map(
                ({ id, imageUrl, publisher, title }) =>
                    `
                <li class="preview">
                    <a
                        class="preview__link preview__link--active"
                        href="#${id}"
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

    #clearSpinner() {
        this.#clear(this.#parentEl.querySelector('.spinner'));
    }

    #clear(element) {
        this.#parentEl.removeChild(element);
    }

    addHandlerRender({ handler, DOMElement }) {
        DOMElement.addEventListener('submit', handler.bind(this));
    }
}

export default new RecipesView();
