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

    render(data) {
        this.#data = data;

        const markup = this.#generateMarkup();
        console.log(markup);
    }

    #generateMarkup() {
        const { recipes, results } = this.#data;

        return recipes
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
                                        href="src/img/icons.svg#icon-user"
                                    ></use>
                                </svg>
                            </div>
                        </div>
                    </a>
                </li>
            `
            )
            .join('');
    }

    addHandlerRender({ handler, form }) {
        form.addEventListener('submit', handler.bind(this));
    }
}

export default new RecipesView();
