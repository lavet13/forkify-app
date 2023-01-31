import icons from '../../img/icons.svg';
import { parseHTML } from '../helpers';
import recipeView from './recipeView';

class ServingsView {
    _parentEl = document.querySelector('.recipe');
    _paramValue;
    #data;

    constructor() {}

    increaseServings() {
        ++this._paramValue;
    }

    decreaseServings() {
        if (this._paramValue <= 1) return;
        --this._paramValue;
    }

    render() {
        console.log(
            parseHTML(recipeView._markup).querySelector(
                `.${recipeView._childEl}`
            ).children
        );

        recipeView._markup = `
        
        `;
    }
}

export default new ServingsView();
