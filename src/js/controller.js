import 'core-js/stable'; //polyfilling everything else
import 'regenerator-runtime/runtime'; // polyfilling async/await

import recipeView from './views/recipeView';
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

async function controlRecipes() {
    // application logic
    try {
        const id = window.location.hash.slice(1);
        if (!id) return;

        this.renderSpinner();

        const { loadRecipe } = Model;
        await loadRecipe(id);

        const {
            state: { recipe },
        } = Model;

        const currentRecipe = JSON.parse(JSON.stringify(recipe));
        const validRecipe = getValidProperties(currentRecipe);

        await this.render(validRecipe);
    } catch (err) {
        this.renderError(err.message);
    }
}

const getValidProperties = recipe =>
    Object.fromEntries(
        Object.entries(recipe).map(([key, value]) => {
            const splitString = key.split('_');

            if (splitString.length < 2) return [key, value];

            const newKey = splitString.reduce((str, cur, i) => {
                if (i === 0) return (str += cur);

                return (str += cur.replace(cur[0], cur[0].toUpperCase()));
            }, ``);

            return [newKey, value];
        })
    );

// PUBLISHER-SUBSCRIBER PATTERN
// We want handle events in the controller because otherwise, we would have application logic in the view and of course we don't want that
// on the other hand we want to listen for events in the view because otherwise we would need DOM elements in the controller, and
// we would basically have presentation logic in the controller which would be wrong in our MVC implementation.
// Event listeners should be attached to DOM elements in the view, but the events should then be handled by controller functions that
// live in the controller module.

const init = function () {
    recipeView.renderMessage();

    recipeView.addHandlerRender(controlRecipes);
};

init();

// https://forkify-api.herokuapp.com/v2
