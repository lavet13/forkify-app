import recipeView from './views/recipeView';
import recipesView from './views/recipesView';
import { getValidProperties, parseHTML } from './helpers';
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
        throw { err, view: this };
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
        throw { err, view: this };
    }
};

export const alreadySearched = function (param, query) {
    const { searchParams } = new URL(window.location);
    const storedQuery = searchParams.get(param);
    return query === storedQuery ? 1 : 0;
};

export const pushURL = function (query, ...others) {
    const otherContent = others.map(other => {
        return {
            _childEl: other._childEl,
            markup: other._parentEl.querySelector(`.${other._childEl}`)
                ?.outerHTML,
        };
    });

    const url = new URL(window.location);
    const param = encodeURIComponent(query);
    url.searchParams.set(this._paramSearch, param);

    const newUrl = `${url.origin}/${url.search}`;
    const JSONObject = JSON.stringify({
        markup: this._parentEl.querySelector(`.${this._childEl}`).outerHTML,
        _childEl: this._childEl,
        otherMarkup: otherContent,
    });

    history.pushState(JSONObject, document.title, `${newUrl}`);
};

export const getViews = function ({ markup, _childEl }, otherMarkup) {
    const entireMarkup = new Map(
        Array.from(otherMarkup)
            .filter(([_, value]) => value)
            .map(([key, value]) => [
                key,
                parseHTML(value).querySelector(`.${key}`),
            ])
    );

    entireMarkup.set(_childEl, parseHTML(markup).querySelector(`.${_childEl}`));

    return Array.from(entireMarkup, ([key, value]) => {
        if (recipeView.isOwner(key)) return [recipeView, value];
        if (recipesView.isOwner(key)) return [recipesView, value];
    });
};
