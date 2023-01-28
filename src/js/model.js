import { API_URL, API_KEY } from './config';
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
        };
    } catch (err) {
        throw err;
    }
};

export const getSearchResultsPage = function (page) {
    const start = (page - 1) * 10;
    const end = page * 10;

    return state.search.recipes.slice(start, end);
};
