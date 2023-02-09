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

export const sendRecipe = async function (recipe) {
    console.log(recipe);
    const res = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
    });

    const result = await res.json();
    console.log(result);
};
