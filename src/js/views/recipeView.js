import View from './View';

import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
import { timeout } from '../helpers';
import { TIMEOUT_SEC } from '../config';

// presentation logic
class RecipeView extends View {
    _parentEl = document.querySelector('.recipe');
    _childEl = `entire__recipe`;
    _paramSearch = 'id';
    _defaultMessage = `Start by searching for a recipe or an ingredient. Have fun!`;
    #data;

    constructor() {
        super();
    }

    addHandlerRender(handler) {
        window.addEventListener('popstate', handler.bind(this));
    }

    async render(recipe) {
        try {
            this.#data = recipe;

            const markup = await this.#generateMarkup();

            this._parentEl.insertAdjacentHTML('beforeend', markup);

            const image = this.#getImageFromRecipe(
                this._parentEl.querySelector(`.${this._childEl}`)
            );

            await Promise.race([
                this.#downloadImage(image),
                timeout(TIMEOUT_SEC),
            ]);

            this._parentEl.querySelector('.spinner') && this._clearSpinner();
        } catch (err) {
            throw err;
        }
    }

    async renderOnHistoryNavigation(markup) {
        try {
            this._parentEl.insertAdjacentHTML('beforeend', markup);

            const image = this.#getImageFromRecipe(
                this._parentEl.querySelector(`.${this._childEl}`)
            );

            await Promise.race([
                this.#downloadImage(image),
                timeout(TIMEOUT_SEC),
            ]);

            this._parentEl.querySelector('.spinner') && this._clearSpinner();
        } catch (err) {
            throw err;
        }
    }

    #downloadImage(image) {
        return new Promise((resolve, reject) => {
            image.addEventListener('load', e => {
                e.target
                    .closest(`.${this._childEl}`)
                    .classList.remove('hidden');
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
            <div class="${this._childEl} hidden">
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
