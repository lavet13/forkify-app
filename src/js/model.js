import { API_URL } from './config';
import { getJSON } from './helpers';

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
