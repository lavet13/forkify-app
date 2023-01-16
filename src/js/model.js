import { API_URL } from './config';
import { API_KEY } from './config';
import { getJSON } from './helpers';
import { processAjaxData } from './helpers';

export const state = {
    recipe: {},
    search: {},
    bookmarks: [],
};

// business logic
export async function loadRecipe(id) {
    try {
        const {
            data: { recipe },
        } = await getJSON(`${API_URL}/${id}`);

        state.recipe = recipe;
    } catch (err) {
        throw new Error(
            `We could not find that recipe. Please try another one!`
        );
    }
}

export async function loadSearchResults(query) {
    try {
        processAjaxData(query);

        const {
            results,
            data: { recipes },
        } = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);

        return { results, recipes };
    } catch (err) {
        throw err;
    }
}
