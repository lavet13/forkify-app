import recipeView from './views/recipeView';
import resultsView from './views/resultsView';

export default class HistoryAPI {
    static historyViews = new Map([
        [recipeView._id, recipeView],
        [resultsView._id, resultsView],
    ]);

    constructor() {}

    static setURL(paramKey, paramValue) {
        const url = new URL(window.location);
        const { searchParams } = url;
        searchParams.set(paramKey, paramValue);
        const newURL = `${url.origin}/${url.search}`;
        history.pushState(null, document.title, newURL);
    }

    static setHistory(...views) {
        const url = new URL(window.location);
        const pageURL = `${url.origin}${url.search}`;

        const markupViews = views.map(([id, view]) => [id, view._markup]);

        const JSONObject = JSON.stringify(markupViews);

        history.replaceState(JSONObject, document.title, pageURL);
    }

    static addHandlerOnLoad(handler) {
        window.addEventListener('load', handler.bind(this));
    }

    static addHandlerOnPopState(handler) {
        window.addEventListener('popstate', handler.bind(this));
    }
}
