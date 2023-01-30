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
