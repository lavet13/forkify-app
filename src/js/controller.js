import 'regenerator-runtime/runtime'; // polyfilling async/await

import View from './views/View';
import recipeView from './views/recipeView';
import recipesView from './views/recipesView';
import searchView from './views/searchView';
import clickRecipeView from './views/clickRecipeView';
import paginationView from './views/paginationView';
import {
    renderRecipe,
    renderRecipeList,
    renderRecipePagination,
    pushURL,
    getViews,
    isAlreadySearched,
} from './controllerHelpers';

import * as Model from './model';

const controlRecipes = async function (e) {
    // application logic
    try {
        const query = clickRecipeView.getQuery(e.target);
        if (isAlreadySearched(recipeView.getParamSearch(), query)) return;

        if (!query) return;

        await renderRecipe.call(recipeView, query);

        pushURL.call(recipeView, query, recipesView, paginationView);
    } catch (err) {
        const { err: error, view } = err;
        error.message && view.renderError(error.message);
    }
};

const controlSearchResults = async function () {
    try {
        const query = searchView.getQuery();
        const pageNumber = 1;
        if (isAlreadySearched(recipesView.getParamSearch(), query)) return;

        if (!query) return;

        const { resultsCount } = await renderRecipeList.call(
            recipesView,
            query
        );

        if (resultsCount > 10) {
            await renderRecipePagination.call(paginationView, pageNumber);
            paginationView.addHandlerRender(controlPaginationResults);
        }

        pushURL.call(
            recipesView,
            [
                [recipesView, query],
                [paginationView, 1],
            ],
            recipeView,
            paginationView
        );
    } catch (err) {
        const { err: error, view } = err;
        error.message && view.renderError(error.message);
    }
};

const controlPaginationResults = async function (e) {
    try {
        const pageNumber = paginationView.getQuery(e.target);
        if (!pageNumber) return;

        const { getSearchResultsPage } = Model;

        const query = getSearchResultsPage(pageNumber);

        await renderRecipeList.call(recipesView, query, pageNumber);
        await renderRecipePagination.call(paginationView, pageNumber);

        pushURL.call(paginationView, query, recipesView, recipeView);
    } catch (err) {
        const { err: error, view } = err;
        error.message && view.renderError(error.message);
    }
};

//////////////////////////////////////////////////////////////////////
// HISTORY API

const handleHistoryNavigation = async function (e) {
    try {
        if (e.state) {
            const { markup, _childEl, otherMarkup } = JSON.parse(e.state);

            const hiddenMarkup = View.addHiddenClassToMarkup(markup, _childEl);
            const othersHiddenMarkup = otherMarkup.reduce(
                (acc, { _childEl, markup }) => {
                    return acc.set(
                        _childEl,
                        View.addHiddenClassToMarkup(markup, _childEl)
                    );
                },
                new Map([])
            );

            const views = getViews(
                { markup: hiddenMarkup, _childEl },
                othersHiddenMarkup
            );

            views.forEach(([view]) => view.renderSpinner());
            views.forEach(
                async ([view, markup]) =>
                    await view.renderOnHistoryNavigation(markup.outerHTML)
            );
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
            console.log(key, value);
            if (key === 'search') {
                await renderRecipeList.call(
                    recipesView,
                    decodeURIComponent(value)
                );
            }

            if (key === 'page') {
                await renderRecipePagination.call(
                    paginationView,
                    decodeURIComponent(value)
                );
            }

            if (key === 'id') {
                await renderRecipe.call(recipeView, decodeURIComponent(value));
            }
        }
    } catch (err) {
        const { err: error, view } = err;
        error.message && view.renderError(error.message);
    }
};

const init = function () {
    try {
        recipeView.renderMessage();

        // BASED ON ACTION OF THE USER
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
