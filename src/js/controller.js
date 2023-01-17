import 'core-js/stable'; //polyfilling everything else
import 'regenerator-runtime/runtime'; // polyfilling async/await

import recipeView from './views/recipeView';
import recipesView from './views/recipesView';
import { renderRecipe, renderRecipeList } from './controllerHelpers';
import { historyPushURL } from './controllerHelpers';

async function controlRecipes(e) {
    // application logic
    try {
        e.preventDefault();

        if (!e.target.closest('.preview__link')) return;
        const id = e.target.closest('.preview__link').getAttribute('href');

        await renderRecipe.call(this, id);

        historyPushURL({ query: id, handler: this.pushURL.bind(this) });
    } catch (err) {
        this.renderError(err.message);
    }
}

async function controlSearchResults(e) {
    try {
        e.preventDefault();

        const { result } = Object.fromEntries(new FormData(e.target).entries());

        await renderRecipeList.call(this, result);

        historyPushURL({ query: result, handler: this.pushURL.bind(this) });
    } catch (err) {
        console.error(err);
        err.message && this.renderError(err.message);
    }
}

// HISTORY API
const handleHistoryNavigationOnRecipe = async function (e) {
    try {
        if (e.state) {
            const { markup } = JSON.parse(e.state);
            if (!this.isValidMarkup(markup)) return;
            const hiddenMarkup = this.addHiddenClassToMarkup(markup);
            this.renderSpinner();
            await this.renderOnHistoryNavigation(hiddenMarkup);
        }
    } catch (err) {
        console.error(err);
        err.message && this.renderError(err.message);
    }
};

const handleHistoryNavigationOnSearch = async function (e) {
    try {
        if (e.state) {
            const { markup } = JSON.parse(e.state);
            if (!this.isValidMarkup(markup)) return;
            const hiddenMarkup = this.addHiddenClassToMarkup(markup);
            this.renderSpinner();
            await this.renderOnHistoryNavigation(hiddenMarkup);
        }
    } catch (err) {
        console.error(err);
        err.message && this.renderError(err.message);
    }
};

async function loadDataBasedOnURL() {
    try {
        const url = new URL(window.location);
        console.log(url.searchParams);

        for (const [key, value] of url.searchParams) {
            if (key === 'search') {
                await renderRecipeList.call(
                    recipesView,
                    decodeURIComponent(value)
                );
            }

            if (key === 'id') {
                await renderRecipe.call(recipeView, decodeURIComponent(value));
            }
        }
    } catch (err) {
        console.error(err);
    }
}

const init = function () {
    try {
        recipeView.renderMessage();

        recipeView.addHandlerRender({
            handler: controlRecipes,
            DOMElement: document.querySelector('.search-results'),
            events: ['click'],
        });
        recipeView.addHandlerRender({
            handler: handleHistoryNavigationOnRecipe,
            DOMElement: window,
            events: ['popstate'],
        });
        ///////////////////////////////////////////////
        recipesView.addHandlerRender({
            handler: controlSearchResults,
            DOMElement: document.querySelector('.search'),
            events: ['submit'],
        });
        recipesView.addHandlerRender({
            handler: handleHistoryNavigationOnSearch,
            DOMElement: window,
            events: ['popstate'],
        });
        ////////////////////////////////////////////////
        // Produce data based on url
        window.addEventListener('load', loadDataBasedOnURL);
    } catch (err) {
        console.error(err);
    }
};

init();

// https://forkify-api.herokuapp.com/v2
