import 'core-js/stable'; //polyfilling everything else
import 'regenerator-runtime/runtime'; // polyfilling async/await
import icons from 'url:../img/icons.svg';

import RecipeView from './views/recipe-view';
import { loadRecipe } from './model';

async function controlRecipe() {
    const id = window.location.hash.slice(1);

    if (!id) return;

    await controlRecipes(this, id);
}

const getValidProperties = recipe =>
    Object.fromEntries(
        Object.entries(recipe).map(([key, value]) => {
            const splitString = key.split('_');

            if (splitString.length < 2) return [key, value];

            const newKey = splitString.reduce((str, cur, i) => {
                if (i === 0) return (str += cur);

                return (str += cur.replace(cur[0], cur[0].toUpperCase()));
            }, ``);

            return [newKey, value];
        })
    );

async function controlRecipes(recipeView, id) {
    const recipeContainer = document.querySelector('.recipe');

    recipeView.renderSpinner(recipeContainer);

    const { data: recipe } = await Promise.race([loadRecipe(id), timeout(15)]);

    const currentRecipe = getValidProperties(recipe);
    console.log(currentRecipe);
}

function init() {
    const recipeView = new RecipeView();
    recipeView.addHandlerRender(controlRecipe);
}

init();

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(
                new Error(`Request took too long! Timeout after ${s} seconds`)
            );
        }, s * 1000);
    });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
/*

console.log('Test');

const getJSON = async url => {
    try {
        const res = await fetch(url);
        const { status } = res;

        if (!res.ok) {
            const { message } = await res.json();
            throw new Error(`${message} (${status})`);
        }

        return await res.json();
    } catch (err) {
        throw err;
    }
};

const renderSpinner = function (parentEl) {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
    `;

    parentEl.replaceChildren();
    parentEl.insertAdjacentHTML('afterbegin', markup);
};

const showRecipe = async function () {
    try {
        const id = window.location.hash.slice(1);

        if (!id) return;

        renderSpinner(recipeContainer);

        const {
            data: { recipe: recipeData },
        } = await Promise.race([
            getJSON(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`),
            timeout(15),
        ]);

        let recipe = Object.fromEntries(
            Object.entries(recipeData).map(([key, value]) => {
                const str = key.split('_');

                if (str.length < 2) return [key, value];

                const finalStr = str
                    .map((word, i) => {
                        if (i === 0) return word;
                        // return word[0].toUpperCase() + word.slice(1);
                        return word.replace(word[0], word[0].toUpperCase());
                    })
                    .join('');

                return [finalStr, value];
            })
        );
        console.log(recipe);

        const {
            id: idGood,
            cookingTime,
            imageUrl,
            ingredients,
            publisher,
            servings,
            sourceUrl,
            title,
        } = recipe;

        const markup = `
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

        recipeContainer.replaceChildren();

        recipeContainer.insertAdjacentHTML('afterbegin', markup);
    } catch (err) {
        alert(err);
    }
};

// showRecipe(
//     // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
//     'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bca36'
// );

['hashchange', 'load'].forEach(ev => window.addEventListener(ev, showRecipe));

*/
