import { getValidProperties } from './helpers';
import * as Model from './model';

export const renderRecipe = async function (id) {
    try {
        if (!id) return;

        const { loadRecipe } = Model;
        await loadRecipe(id);

        this.renderSpinner();

        const {
            state: { recipe },
        } = Model;

        const currentRecipe = JSON.parse(JSON.stringify(recipe));
        const validRecipe = getValidProperties(currentRecipe);

        await this.render(validRecipe);
    } catch (err) {
        throw err;
    }
};

export const renderRecipeList = async function (query) {
    try {
        if (!query) return;

        const { loadSearchResults } = Model;
        await loadSearchResults(query);
        this.renderSpinner();

        const {
            state: {
                search: { recipes: recipesArray, results },
            },
        } = Model;

        const validRecipes = recipesArray.map(recipe =>
            getValidProperties(recipe)
        );
        const currentRecipes = { results, recipes: validRecipes };

        await this.render(currentRecipes);
    } catch (err) {
        throw err;
    }
};

export const alreadySearched = function (param, query) {
    const { searchParams } = new URL(window.location);
    const storedQuery = searchParams.get(param);
    return query === storedQuery ? 1 : 0;
};

export const historyPushURL = ({ handler, query }) => {
    handler(query);
};
