export const state = {
    recipe: {},
    search: {},
    bookmarks: [],
};

// const getJSON = async url => {
//     try {
//         const res = await fetch(url);
//         const { status } = res;

//         if (!res.ok) {
//             const { message } = await res.json();
//             throw new Error(`${message} (${status})`);
//         }

//         return await res.json();
//     } catch (err) {
//         throw err;
//     }
// };

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

        state.recipe = await res.json();

        return state.recipe;
    } catch (err) {
        throw err;
    }
}
