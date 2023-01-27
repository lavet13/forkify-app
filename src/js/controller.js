import 'regenerator-runtime/runtime'; // polyfilling async/await
import 'core-js/stable';

import clickTheRecipe from './views/clickTheRecipe';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import HistoryAPI from './historyAPI';
import { timeout } from './helpers';
import { TIMEOUT_SEC } from './config';

import * as Model from '../js/model';

const controlRecipe = async function (e) {
    try {
        const query = clickTheRecipe.getQuery(e.target);
        if (!query) return;
        recipeView.renderSpinner();

        HistoryAPI.setURL(clickTheRecipe._param, query);

        const { loadRecipe } = Model;

        await loadRecipe(query);

        const {
            state: { recipe },
        } = Model;

        await recipeView.render(recipe);
    } catch (err) {
        recipeView.renderError(err);
    } finally {
        // add content in history API LULE
        HistoryAPI.setHistory(...HistoryAPI.historyViews);
    }
};

const controlSearchResults = async function (e) {
    try {
        const query = searchView.getQuery();
        if (!query) return;
        resultsView.renderSpinner();

        HistoryAPI.setURL(searchView._param, query);

        const { loadSearchResults } = Model;

        await loadSearchResults(query);

        // numberOfRecipes suppose to be with pagination
        const {
            state: {
                search: { results: numberOfRecipes, recipes },
            },
        } = Model;

        await resultsView.render(recipes);
    } catch (err) {
        resultsView.renderError(err);
    } finally {
        // add content in histroy API LULE
        HistoryAPI.setHistory(...HistoryAPI.historyViews);
    }
};

const controlOnLoad = function () {};

const controlOnPopState = function (e) {
    if (!e.state) return;

    const { searchParams } = new URL(window.location);

    searchView._parentEl.querySelector(`[name="query"]`).value =
        searchParams.get('search');

    const markupViews = JSON.parse(e.state);
    markupViews.forEach(async ([id, markup]) => {
        try {
            switch (id) {
                case recipeView._id:
                    if (!markup) break;

                    recipeView.renderSpinner();
                    const spinnerRecipe = recipeView._parentEl.querySelector(
                        `.${recipeView._spinner}`
                    );

                    recipeView._hiddenMarkup =
                        recipeView._addHiddenClass(markup);

                    recipeView._parentEl.insertAdjacentHTML(
                        'beforeend',
                        recipeView._hiddenMarkup
                    );
                    await Promise.race([
                        recipeView._downloadImage(
                            recipeView._parentEl.querySelector(`.recipe__img`)
                        ),
                        timeout(TIMEOUT_SEC),
                    ]);

                    spinnerRecipe && spinnerRecipe.remove();
                    break;

                case resultsView._id:
                    if (!markup) break;

                    resultsView.renderSpinner();
                    const spinnerResults = resultsView._parentEl.querySelector(
                        `.${resultsView._spinner}`
                    );

                    resultsView._hiddenMarkup =
                        resultsView._addHiddenClass(markup);

                    resultsView._parentEl.insertAdjacentHTML(
                        'afterbegin',
                        resultsView._hiddenMarkup
                    );

                    await Promise.all(
                        resultsView._downloadImages(
                            Array.from(
                                resultsView._parentEl.querySelectorAll(
                                    `.preview__fig img`
                                )
                            )
                        )
                    );

                    resultsView._parentEl
                        .querySelector(`.${resultsView._childEl}`)
                        .classList.remove('hidden');

                    spinnerResults && spinnerResults.remove();
                    break;
            }
        } catch (err) {
            console.error(err);
        }
    });
};

const init = function () {
    clickTheRecipe.addHandlerRender(controlRecipe);
    searchView.addHandlerRender(controlSearchResults);
    HistoryAPI.addHandlerOnLoad(controlOnLoad);
    HistoryAPI.addHandlerOnPopState(controlOnPopState);
};

init();

// https://forkify-api.herokuapp.com/v2
