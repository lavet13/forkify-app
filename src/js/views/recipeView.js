import icons from '../../img/icons.svg';

// presentation logic
class RecipeView {
    #data;
    #parentEl = document.querySelector('.recipe');

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

    addHandlerRender(callback) {
        ['hashchange', 'load'].forEach(ev =>
            window.addEventListener(ev, callback.bind(this))
        );
    }

    async render(recipe) {
        this.#data = recipe;
        const markup = await this.#generateMarkup();

        this.#parentEl.replaceChildren();
        this.#parentEl.insertAdjacentHTML('afterbegin', markup);
    }

    async #generateMarkup() {
        const {
            id,
            cookingTime,
            imageUrl,
            ingredients,
            publisher,
            servings,
            sourceUrl,
            title,
        } = this.#data;

        const getImage = await this.#downloadImage(imageUrl, title);

        return `
            <figure class="recipe__fig">
                ${getImage}
                <h1 class="recipe__title">
                    <span>${title}</span>
                </h1>
            </figure>

            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                    <use href="${icons}#icon-clock"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${cookingTime}</span>
                    <span class="recipe__info-text">minutes</span>
                </div>

                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="${icons}#icon-users"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${servings}</span>
                    <span class="recipe__info-text">servings</span>
                    <div class="recipe__info-buttons">
                        <button class="btn--tiny btn--increase-servings">
                            <svg>
                            <use href="${icons}#icon-minus-circle"></use>
                            </svg>
                        </button>

                        <button class="btn--tiny btn--increase-servings">
                            <svg>
                            <use href="${icons}#icon-plus-circle"></use>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="recipe__user-generated">
                    <svg>
                        <use href="${icons}#icon-user"></use>
                    </svg>
                </div>
                <button class="btn--round">
                    <svg class="">
                        <use href="${icons}#icon-bookmark-fill"></use>
                    </svg>
                </button>
            </div>

            <div class="recipe__ingredients">
                <h2 class="heading--2">Recipe ingredients</h2>
                
                <ul class="recipe__ingredient-list">
                    ${ingredients
                        .map(({ quantity, unit, description }) => {
                            return `
                                <li class="recipe__ingredient">
                                <svg class="recipe__icon">
                                    <use href="${icons}#icon-check"></use>
                                </svg>
                                <div class="recipe__quantity">${quantity}</div>
                                <div class="recipe__description">
                                    <span class="recipe__unit">${unit}</span>
                                    ${description}
                                </div>
                                </li>
                            `;
                        })
                        .join('')}
                </ul>
            </div>

            <div class="recipe__directions">
                <h2 class="heading--2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__publisher">${publisher}</span>. Please check out
                    directions at their website.
                </p>
                <a
                    class="btn--small recipe__btn"
                    href="${sourceUrl}"
                    target="_blank"
                >
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </a>
            </div>
        `;
    }

    #downloadImage(url, title, className = 'recipe__img') {
        return new Promise((resolve, reject) => {
            const image = document.createElement('img');
            image.classList.add(className);
            image.alt = title;
            image.src = url;

            image.addEventListener('load', () => {
                resolve(image.outerHTML);
            });

            image.addEventListener('error', () => {
                reject(new Error(`Error when trying download the image :(`));
            });
        });
    }
}

const view = new RecipeView();
export { view as recipeView };
