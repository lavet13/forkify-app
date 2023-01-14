export const state = {
    recipe: {},
    search: {},
    bookmarks: [],
};

// business logic
export async function loadRecipe(id) {
    try {
        const res = await fetch(
            `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
        );

        const { status } = res;

        if (!res.ok) {
            const { message } = await res.json();
            throw new Error(`${message} (${status})`);
        }

        const {
            data: { recipe },
        } = await res.json();

        state.recipe = recipe;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
