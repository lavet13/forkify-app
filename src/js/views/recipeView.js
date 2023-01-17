import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
import { parseHTML, timeout } from '../helpers';
import { TIMEOUT_SEC } from '../config';

// presentation logic
class RecipeView {
    #data;
    #parentEl = document.querySelector('.recipe');
    #defaultMessage = `Start by searching for a recipe or an ingredient. Have fun!`;

    constructor() {}

    renderMessage(message = this.#defaultMessage) {
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

    addHandlerRender({ handler, DOMElement, events }) {
        if (events.length === 0) throw new Error("Events weren't specified!");

        events.forEach(ev =>
            DOMElement.addEventListener(ev, handler.bind(this))
        );
    }

    async render(recipe) {
        try {
            this.#data = recipe;

            const markup = await this.#generateMarkup();

            this.#parentEl.insertAdjacentHTML('beforeend', markup);

            const image = this.#getImageFromRecipe(
                this.#parentEl.querySelector('.entire__recipe')
            );

            await Promise.race([
                this.#downloadImage(image),
                timeout(TIMEOUT_SEC),
            ]);

            this.#parentEl.querySelector('.spinner') && this.#clearSpinner();
        } catch (err) {
            throw err;
        }
    }

    async renderOnHistoryNavigation(markup) {
        try {
            this.#parentEl.insertAdjacentHTML('beforeend', markup);

            const image = this.#getImageFromRecipe(
                this.#parentEl.querySelector('.entire__recipe')
            );

            await Promise.race([
                this.#downloadImage(image),
                timeout(TIMEOUT_SEC),
            ]);

            this.#parentEl.querySelector('.spinner') && this.#clearSpinner();
        } catch (err) {
            throw err;
        }
    }

    isValidMarkup(markup) {
        if (!markup) return false;

        const parsedMarkup = parseHTML(markup).querySelector('.entire__recipe');
        if (!parsedMarkup) return false;

        return true;
    }

    addHiddenClassToMarkup(markup) {
        const parsedElement =
            parseHTML(markup).querySelector('.entire__recipe');
        parsedElement.classList.add('hidden');
        return parsedElement.outerHTML;
    }

    pushURL(query) {
        const url = new URL(window.location);
        const param = encodeURIComponent(query);
        url.searchParams.set('id', param);

        const newUrl = `${url.origin}${url.search}`;
        const JSONObject = JSON.stringify({
            markup: this.#parentEl.querySelector('.entire__recipe').outerHTML,
        });

        history.pushState(JSONObject, document.title, `${newUrl}`);
    }

    #downloadImage(image) {
        return new Promise((resolve, reject) => {
            image.addEventListener('load', e => {
                e.target.closest('.entire__recipe').classList.remove('hidden');
                resolve();
            });

            image.addEventListener('error', () => {
                reject(new Error(`Cannot download the image`));
            });
        });
    }

    #getImageFromRecipe(recipe) {
        return recipe.querySelector('.recipe__img');
    }

    #clear(element) {
        this.#parentEl.removeChild(element);
    }

    #clearSpinner() {
        this.#clear(this.#parentEl.querySelector('.spinner'));
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

        return `
            <div class="entire__recipe hidden">
                <figure class="recipe__fig">
                    <img src="${imageUrl}" class="recipe__img" alt="${title}">
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
                            .map(this.#generateMarkupIngredients.bind(this))
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
            </div>
        `;
    }

    #generateMarkupIngredients({ description, unit, quantity }) {
        const fraction = this.#calcFraction(quantity);

        return `
            <li class="recipe__ingredient">
            <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
            </svg>
            <div class="${fraction ? 'recipe__quantity' : ''}">${fraction}</div>
            <div class="recipe__description">
                <span class="recipe__unit">${unit}</span>
                ${description}
            </div>
            </li>
        `;
    }

    #calcFraction(quantity) {
        return quantity ? new Fraction(quantity).toString() : '';
    }
}

export default new RecipeView();
