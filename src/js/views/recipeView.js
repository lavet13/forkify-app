import icons from '../../img/icons.svg';
import { timeout, parseHTML, guidGenerator } from '../helpers';
import { TIMEOUT_SEC } from '../config';
import { Fraction } from 'fractional';

class RecipeView {
    _parentEl = document.querySelector('.recipe');
    _childEl = 'recipe__content';
    _spinner = 'spinner';
    _message = 'message';
    _error = 'error';
    _errorMessage = `recipe 😐`;
    _markup = ``;
    _hiddenMarkup = ``;
    _id = 'b9919acb-5223-330a-2f98-02cd1ed5a288';
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

            this.#generateMarkup();
            this._hiddenMarkup = this._addHiddenClass(this._markup);
            const spinner = this._parentEl.querySelector(`.${this._spinner}`);

            this._parentEl.insertAdjacentHTML('beforeend', this._hiddenMarkup);

            await Promise.race([
                this._downloadImage(
                    this._parentEl.querySelector(`.recipe__img`)
                ),
                timeout(TIMEOUT_SEC),
            ]);

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

    #generateMarkup() {
        const {
            cookingTime,
            id,
            imageUrl,
            ingredients,
            publisher,
            servings,
            sourceUrl,
            title,
        } = this.#data;

        this._markup = `
            <div class="${this._childEl}">
                <figure class="recipe__fig">
                  <img src="${imageUrl}" alt="${title}" class="recipe__img" />
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

    _downloadImage(image) {
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
}

export default new RecipeView();
