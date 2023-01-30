import 'regenerator-runtime/runtime'; // polyfilling async/await
import 'core-js/stable';

import clickTheRecipe from './views/clickTheRecipe';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import HistoryAPI from './modules/historyAPI';
import { timeout } from './helpers';
import { TIMEOUT_SEC } from './config';

import * as Model from '../js/model';
import clickThePagination from './views/clickThePagination';

const controlRecipe = async function (e) {
    try {
        const query = clickTheRecipe.getQuery(e.target);
        if (!query) return;

        clickTheRecipe._paramValue = decodeURIComponent(query);
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
        HistoryAPI.setHistory(...HistoryAPI.historyViews);
    }
};

const controlSearchResults = async function (e) {
    try {
        const query = searchView.getQuery();
        if (!query) return;

        searchView._paramValue = decodeURIComponent(query);
        resultsView.renderSpinner();

        HistoryAPI.setURL(searchView._param, searchView._paramValue);
        HistoryAPI.deleteSearchParameter(clickThePagination._param);

        const { loadSearchResults } = Model;

        await loadSearchResults(query);

        const {
            state: {
                search: { results: numberOfRecipes, recipes },
            },
            getSearchResultsPage,
            getTotalCountPage,
        } = Model;
        console.log(numberOfRecipes);

        if (numberOfRecipes > 10) {
            clickThePagination._totalPageCount = getTotalCountPage();
            const { _totalPageCount: totalPageCount } = clickThePagination;
            paginationView.renderSpinner();
            clickThePagination._paramValue = 1;
            const { _paramValue: pageNumber } = clickThePagination;
            const recipesPerPage = getSearchResultsPage(pageNumber);
            HistoryAPI.setURL(clickThePagination._param, pageNumber);
            await resultsView.render(recipesPerPage);
            paginationView.render({ pageNumber, totalPageCount });
            return;
        }

        paginationView._parentEl
            .querySelector(`.${paginationView._childEl}`)
            ?.remove();

        await resultsView.render(recipes);
    } catch (err) {
        resultsView.renderError(err);
    } finally {
        HistoryAPI.setHistory(...HistoryAPI.historyViews);
    }
};

const controlPaginationResults = async function (e) {
    try {
        const button = e.target.closest('.btn--inline');
        if (!button) return;

        if (button.classList.contains('pagination__btn--prev')) {
            clickThePagination.decrementPageNumber();
        }
        if (button.classList.contains('pagination__btn--next')) {
            clickThePagination.incrementPageNumber();
        }

        resultsView.renderSpinner();
        paginationView.renderSpinner();

        const {
            _param: paginationParam,
            _paramValue: pageNumber,
            _totalPageCount: totalPageCount,
        } = clickThePagination;

        HistoryAPI.setURL(paginationParam, pageNumber);

        const { getSearchResultsPage } = Model;
        const recipesPerPage = getSearchResultsPage(pageNumber);
        await resultsView.render(recipesPerPage);
        paginationView.render({ pageNumber, totalPageCount });
    } catch (err) {
        resultsView.renderError(err);
    } finally {
        HistoryAPI.setHistory(...HistoryAPI.historyViews);
    }
};

const controlOnLoad = function () {
    const { searchParams } = new URL(window.location);
    if ([...searchParams.entries()].length === 0) return;
    searchParams.forEach(async (query, param) => {
        try {
            // since search loading all the recipes and at the same time produce pagination buttons,
            // there's no need for page parameter in this case
            if (param === 'search') {
                searchView._parentEl.querySelector(`[name="query"]`).value =
                    decodeURIComponent(searchParams.get('search'));

                resultsView.renderSpinner();

                const { loadSearchResults } = Model;

                await loadSearchResults(decodeURIComponent(query));

                const {
                    state: {
                        search: { results: numberOfRecipes, recipes },
                    },
                    getSearchResultsPage,
                    getTotalCountPage,
                } = Model;

                if (numberOfRecipes > 10) {
                    clickThePagination._totalPageCount = getTotalCountPage();
                    const { _totalPageCount: totalPageCount } =
                        clickThePagination;

                    paginationView.renderSpinner();
                    clickThePagination._paramValue =
                        +decodeURIComponent(
                            searchParams.get(clickThePagination._param)
                        ) ?? 1;
                    const { _paramValue: pageNumber } = clickThePagination;

                    const recipesPerPage = getSearchResultsPage(pageNumber);
                    HistoryAPI.setURL(clickThePagination._param, pageNumber);
                    await resultsView.render(recipesPerPage);
                    paginationView.render({ pageNumber, totalPageCount });
                    return;
                }

                await resultsView.render(recipes);
            }

            if (param === 'id') {
                recipeView.renderSpinner();

                const { loadRecipe } = Model;

                await loadRecipe(decodeURIComponent(query));

                const {
                    state: { recipe },
                } = Model;

                await recipeView.render(recipe);
            }
        } catch (err) {
            resultsView.renderError(err);
            paginationView._parentEl
                .querySelector(`.${paginationView._spinner}`)
                ?.remove();
        }
    });
};

const controlOnPopState = function (e) {
    if (!e.state) {
        console.log('!e.state');
        const { searchParams } = new URL(window.location);
        if ([...searchParams.entries()].length !== 0)
            searchView._parentEl.querySelector(`[name="query"]`).value = '';
        resultsView._parentEl
            .querySelector(`.${resultsView._childEl}`)
            ?.remove();
        recipeView._parentEl.querySelector(`.${recipeView._childEl}`)?.remove();
        paginationView._parentEl
            .querySelector(`.${paginationView._childEl}`)
            ?.remove();
        return;
    }
    console.log('e.state');

    const { searchParams } = new URL(window.location);

    searchView._parentEl.querySelector(`[name="query"]`).value =
        decodeURIComponent(searchParams.get('search'));

    if (!searchParams.get('search'))
        resultsView._parentEl
            .querySelector(`.${resultsView._childEl}`)
            ?.remove();

    if (!searchParams.get('id'))
        recipeView._parentEl.querySelector(`.${recipeView._childEl}`)?.remove();

    if (!searchParams.get('page'))
        paginationView._parentEl
            .querySelector(`.${paginationView._childEl}`)
            ?.remove();

    const markupViews = JSON.parse(e.state);
    console.log(markupViews);
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
                        ?.classList.remove('hidden');

                    spinnerResults && spinnerResults.remove();
                    break;

                case paginationView._id:
                    if (!markup) break;

                    paginationView.renderSpinner();

                    const spinnerPagination =
                        paginationView._parentEl.querySelector(
                            `.${paginationView._spinner}`
                        );

                    paginationView._hiddenMarkup =
                        paginationView._addHiddenClass(markup);

                    paginationView._parentEl.insertAdjacentHTML(
                        'afterbegin',
                        paginationView._hiddenMarkup
                    );
                    paginationView._parentEl
                        .querySelector(`.${paginationView._childEl}`)
                        ?.classList.remove('hidden');

                    spinnerPagination && spinnerPagination.remove();
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
    clickThePagination.addHandlerRender(controlPaginationResults);
    HistoryAPI.addHandlerOnLoad(controlOnLoad);
    HistoryAPI.addHandlerOnPopState(controlOnPopState);
};

init();

// https://forkify-api.herokuapp.com/v2
