import { getValidProperties } from './helpers';
import * as Model from './model';

export async function renderRecipe(id) {
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
}

export async function renderRecipeList(query) {
    try {
        if (!query) return;

        const { loadSearchResults } = Model;
        const recipes = await loadSearchResults(query);
        this.renderSpinner();

        const { recipes: recipesArray, results } = recipes;
        const validRecipes = recipesArray.map(recipe =>
            getValidProperties(recipe)
        );
        const currentRecipes = { results, recipes: validRecipes };

        await this.render(currentRecipes);
    } catch (err) {
        throw err;
    }
}

export const historyPushURL = ({ handler, query }) => {
    handler(query);
};
