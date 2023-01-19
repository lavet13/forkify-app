import 'regenerator-runtime/runtime'; // polyfilling async/await

import View from './views/View';
import recipeView from './views/recipeView';
import recipesView from './views/recipesView';
import searchView from './views/searchView';
import clickRecipeView from './views/clickRecipeView';
import {
    renderRecipe,
    renderRecipeList,
    pushURL,
    alreadySearched,
} from './controllerHelpers';

const controlRecipes = async function (e) {
    // application logic
    try {
        const query = clickRecipeView.getQuery(e.target);
        if (alreadySearched('id', query)) return;

        await renderRecipe.call(recipeView, query);

        pushURL.call(recipeView, query, recipesView);
    } catch (err) {
        console.error(err);
        recipeView.renderError(err.message);
    }
};

const controlSearchResults = async function () {
    try {
        const query = this.getQuery();
        if (alreadySearched('search', query)) return;

        await renderRecipeList.call(recipesView, query);

        pushURL.call(recipesView, query, recipeView);
    } catch (err) {
        console.error(err);
        err.message && recipesView.renderError(err.message);
    }
};

//////////////////////////////////////////////////////////////////////
// HISTORY API
// const handleHistoryNavigationOnRecipe = async function (e) {
//     try {
//         if (e.state) {
//             const { markup } = JSON.parse(e.state);
//             if (!this.isValidMarkup(markup)) return;
//             const hiddenMarkup = this.addHiddenClassToMarkup(markup);
//             this.renderSpinner();
//             await this.renderOnHistoryNavigation(hiddenMarkup);
//         }
//     } catch (err) {
//         console.error(err);
//         err.message && this.renderError(err.message);
//     }
// };

// const handleHistoryNavigationOnSearch = async function (e) {
//     try {
//         if (e.state) {
//             const { markup } = JSON.parse(e.state);
//             if (!this.isValidMarkup(markup)) return;
//             const hiddenMarkup = this.addHiddenClassToMarkup(markup);
//             this.renderSpinner();
//             await this.renderOnHistoryNavigation(hiddenMarkup);
//         }
//     } catch (err) {
//         console.error(err);
//         err.message && this.renderError(err.message);
//     }
// };

const handleHistoryNavigation = async function (e) {
    try {
        if (e.state) {
            const { markup, _childEl, otherMarkup } = JSON.parse(e.state);
            const hiddenMarkup = View.addHiddenClassToMarkup(markup, _childEl);
            console.log(markup, otherMarkup);
        }
    } catch (err) {
        console.error(err);
    }
};

const loadDataBasedOnURL = async function () {
    try {
        const url = new URL(window.location);
        console.log(url.searchParams);

        for (const [key, value] of url.searchParams) {
            if (key === 'search') {
                renderRecipeList.call(recipesView, decodeURIComponent(value));
            }

            if (key === 'id') {
                renderRecipe.call(recipeView, decodeURIComponent(value));
            }
        }
    } catch (err) {
        console.error(err);
    }
};

const init = function () {
    try {
        recipeView.renderMessage();

        clickRecipeView.addHandlerRender(controlRecipes);
        searchView.addHandlerRender(controlSearchResults);
        ////////////////////////////////////////////////
        // Produce data based on url + HISTORY API
        window.addEventListener('popstate', handleHistoryNavigation);
        window.addEventListener('load', loadDataBasedOnURL);
    } catch (err) {
        console.error(err);
    }
};

init();

// https://forkify-api.herokuapp.com/v2
