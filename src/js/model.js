import { API_URL, API_KEY, RES_PER_PAGE } from './config';
import { getJSON, getValidProperties, sendJSON } from './helpers';

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

        const recipeData = getValidProperties(recipe);

        state.recipe = {
            ...recipeData,
            bookmarked: state.bookmarks.some(({ id }) => id === recipeData.id),
        };
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
    });

    state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
    if (!state.bookmarks.some(({ id }) => id === recipe.id)) {
        state.bookmarks.push(recipe);
        state.recipe.bookmarked = true;
        localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
        return false;
    }

    return true;
};

export const deleteBookmark = function (id) {
    const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
    if (index === -1) return true;

    state.bookmarks.splice(index, 1);
    state.recipe.bookmarked = false;

    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
    return false;
};

export const uploadRecipe = async inputs => {
    try {
        const ingredients = Object.entries(inputs)
            .filter(
                ([key, value]) => key.startsWith('ingredient') && value !== ''
            )
            .reduce((acc, [key, value], _, arr) => {
                const ingredient = value.replaceAll(' ', '').split(',');
                if (ingredient.indexOf(',') !== -1)
                    throw new Error(`Invalid data was received. ${key}`);
                if (ingredient.length !== 3)
                    throw new Error(
                        `Wrong ingredient format! Please use the correct format :) ${key}`
                    );
                const [quantity, unit, description] = ingredient;
                acc.push({
                    quantity: quantity ? +quantity : null,
                    unit: !quantity ? '' : unit,
                    description,
                });
                return acc;
            }, []);

        const otherData = Object.entries(inputs).filter(
            ([key]) => !/ingredient-[0-9]/.test(key)
        );

        const recipe = {
            ...Object.fromEntries(
                otherData.map(([key, value]) => {
                    const found = key.match(/[A-Z]/g);
                    if (!found) {
                        if (!(key === 'servings')) return [key, value];

                        if (Number.isFinite(+value)) return [key, +value];

                        if (!Number.isFinite(+value))
                            throw new Error(
                                `The value isn't a number! Please type a number! ${key}`
                            );
                    }

                    const newKey = found
                        .reduce((acc, char) => {
                            const split = key.split(char);
                            split[1] = char.toLowerCase() + split[1];
                            return [...acc, ...split];
                        }, [])
                        .join('_');

                    if (newKey === 'cooking_time' && Number.isFinite(+value)) {
                        return [newKey, +value];
                    }

                    if (!Number.isFinite(+value) && newKey === 'cooking_time')
                        throw new Error(
                            `The value isn't a number! Please type a number instead on a field ${newKey}`
                        );

                    return [newKey, value];
                })
            ),
            ingredients,
        };

        const {
            data: { recipe: recipeData },
        } = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);

        state.recipe = getValidProperties(recipeData);
    } catch (err) {
        throw err;
    }
};
