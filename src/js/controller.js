import 'core-js/stable'; //polyfilling everything else
import 'regenerator-runtime/runtime'; // polyfilling async/await

import recipeView from './views/recipeView';
import recipesView from './views/recipesView';
import { getValidProperties } from './helpers';
import { historyPushURL } from './helpers';
import * as Model from './model';

// PUBLISHER-SUBSCRIBER PATTERN
// We have a publisher which is soem code that knows when to react,
// and in this case, that's going to be the addHandlerRender function in the view, because it will
// contain the addEventListener method. And therefore, it will know when to react to the event.
// Now, on the other hand, we have a subscriber which is code that actually wants to react.
// So this is the code that should actually be executed when the event happens. And in this case,
// that is the controlRecipes function that we have in the controller. And publisher doesn't know
// yet that the subscriber even exists because that subscriber is in the controller that the view
// cannot access. Solution is that we can now subscribe to the publisher by passing into subscriber
// function as an argument. In practice that means as soon as the program loads, the init function
// is called which in turn immediately calls the addHandlerRender function from the view.
// As we call addHandlerRender, we pass in our controlRecipes function as an argument.
// So essentially, we subscribe controlRecipes to addHandlerRender. And so at this point, the two
// functions are basically finally connected. So now addHandlerRender listens for events using
// the addEventListener method as always. And then as soon as the event actually happens,
// the controlRecipes function will be called as the callback function of addEventListener.
// Or in other words, as soon as the publisher(addHandlerRender) publishes an event, the subscriber(controlRecipes)
// will get called.

async function controlRecipes(e) {
    // application logic
    try {
        e.preventDefault();
        if (!e.target.closest('.preview__link')) return;
        const id = e.target.closest('.preview__link').getAttribute('href');
        console.log(`id = ${id}`);
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

        historyPushURL({ query: id, handler: this.pushURL.bind(this) });
    } catch (err) {
        this.renderError(err.message);
    }
}

const handleHistoryNavigationOnRecipe = async function (e) {
    try {
        if (e.state) {
            const { markup } = JSON.parse(e.state);
            if (!this.isValidMarkup(markup)) return;
            const hiddenMarkup = this.addHiddenClassToMarkup(markup);
            this.renderSpinner();
            await this.renderOnHistoryNavigation(hiddenMarkup);
        }
    } catch (err) {
        console.error(err);
        err.message && this.renderError(err.message);
    }
};

async function controlSearchResults(e) {
    try {
        e.preventDefault();

        const { result } = Object.fromEntries(new FormData(e.target).entries());

        const { loadSearchResults } = Model;
        const recipes = await loadSearchResults(result);
        this.renderSpinner();

        const { recipes: recipesArray, results } = recipes;
        const validRecipes = recipesArray.map(recipe =>
            getValidProperties(recipe)
        );
        const currentRecipes = { results, recipes: validRecipes };

        await this.render(currentRecipes);

        historyPushURL({ query: result, handler: this.pushURL.bind(this) });
    } catch (err) {
        console.error(err);
        err.message && this.renderError(err.message);
    }
}

const handleHistoryNavigationOnSearch = async function (e) {
    try {
        if (e.state) {
            const { markup } = JSON.parse(e.state);
            if (!this.isValidMarkup(markup)) return;
            const hiddenMarkup = this.addHiddenClassToMarkup(markup);
            this.renderSpinner();
            await this.renderOnHistoryNavigation(hiddenMarkup);
        }
    } catch (err) {
        console.error(err);
        err.message && this.renderError(err.message);
    }
};

// PUBLISHER-SUBSCRIBER PATTERN
// We want handle events in the controller because otherwise, we would have application logic in the view and of course we don't want that
// on the other hand we want to listen for events in the view because otherwise we would need DOM elements in the controller, and
// we would basically have presentation logic in the controller which would be wrong in our MVC implementation.
// Event listeners should be attached to DOM elements in the view, but the events should then be handled by controller functions that
// live in the controller module.

const init = function () {
    try {
        recipeView.renderMessage();

        recipeView.addHandlerRender({
            handler: controlRecipes,
            DOMElement: document.querySelector('.search-results'),
            events: ['click'],
        });
        recipeView.addHandlerRender({
            handler: handleHistoryNavigationOnRecipe,
            DOMElement: window,
            events: ['popstate'],
        });
        ///////////////////////////////////////////////
        recipesView.addHandlerRender({
            handler: controlSearchResults,
            DOMElement: document.querySelector('.search'),
            events: ['submit'],
        });
        recipesView.addHandlerRender({
            handler: handleHistoryNavigationOnSearch,
            DOMElement: window,
            events: ['popstate'],
        });
    } catch (err) {
        console.error(err);
    }
};

init();

// https://forkify-api.herokuapp.com/v2
