import { API_URL, API_KEY, RES_PER_PAGE } from './config';
import { getJSON } from './helpers';

export const state = {
    recipe: {},
    search: {
        query: '',
        resultsCount: '',
        results: [],
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};

// business logic
export const loadRecipe = async function (id) {
    try {
        const {
            data: { recipe },
        } = await getJSON(`${API_URL}${id}`);

        state.recipe = recipe;
    } catch (err) {
        throw new Error(
            `We could not find that recipe. Please try another one!`
        );
    }
};

export const loadSearchResults = async function (query) {
    try {
        const {
            results,
            data: { recipes },
        } = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);

        state.search.results = recipes;
        state.search.resultsCount = results;
    } catch (err) {
        throw err;
    }
};

export const getSearchResultsPage = function (page) {
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
};
