import { API_URL, API_KEY, RES_PER_PAGE } from './config';
import { getJSON, getValidProperties } from './helpers';

export const state = {
    recipe: {},
    search: {},
    bookmarks: [],
};

// business logic
export const loadRecipe = async function (id) {
    try {
        const {
            data: { recipe },
        } = await getJSON(`${API_URL}${id}`);

        state.recipe = getValidProperties(recipe);
    } catch (err) {
        throw err;
    }
};

export const loadSearchResults = async function (query) {
    try {
        const {
            results,
            data: { recipes },
        } = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);

        state.search = {
            results,
            recipes: recipes.map(recipe => getValidProperties(recipe)),
            resultsPerPage: RES_PER_PAGE,
        };
    } catch (err) {
        throw err;
    }
};

export const getSearchResultsPage = function (page) {
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.recipes.slice(start, end);
};

export const getTotalCountPage = function () {
    return Math.trunc(state.search.results / state.search.resultsPerPage);
};

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
        // newQt = oldQt * newServings / oldServings; // 2 * 8 / 4 = 4
    });

    state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
    state.bookmarks.push(recipe);
    recipe.id === state.recipe.id && (state.recipe.bookmarked = true);
};
