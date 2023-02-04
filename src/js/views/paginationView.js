import icons from '../../img/icons.svg';
import { parseHTML } from '../helpers';

class PaginationView {
    _parentEl = document.querySelector('.pagination');
    _childEl = `buttons`;
    _spinner = 'spinner';
    _message = 'message';
    _error = 'error';
    _errorMessage = `Something went wrong with buttons :(`;
    _markup = ``;
    _newMarkup = ``;
    _hiddenMarkup = ``;
    _id = 'ac1f4d84-3402-f04d-c36d-1ea3761e8018';
    #data;

    constructor() {}

    renderError(message = this._errorMessage) {
        const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;

        const childEl = this._parentEl.querySelectorAll(`.${this._childEl}`);
        const messageEl = this._parentEl.querySelectorAll(`.${this._message}`);
        const spinnerEl = this._parentEl.querySelectorAll(`.${this._spinner}`);

        if (childEl.length !== 0)
            childEl.forEach(child => this._parentEl.removeChild(child));
        if (messageEl.length !== 0)
            messageEl.forEach(child => this._parentEl.removeChild(child));
        if (spinnerEl.length !== 0)
            spinnerEl.forEach(child => this._parentEl.removeChild(child));

        this._parentEl.insertAdjacentHTML('afterbegin', markup);
    }

    renderSpinner() {
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;

        const childEl = this._parentEl.querySelectorAll(`.${this._childEl}`);
        const messageEl = this._parentEl.querySelectorAll(`.${this._message}`);
        const errorMessageEl = this._parentEl.querySelectorAll(
            `.${this._error}`
        );

        if (childEl.length !== 0)
            childEl.forEach(child => this._parentEl.removeChild(child));
        if (messageEl.length !== 0)
            messageEl.forEach(child => this._parentEl.removeChild(child));
        if (errorMessageEl.length !== 0)
            errorMessageEl.forEach(child => this._parentEl.removeChild(child));

        this._parentEl.insertAdjacentHTML('afterbegin', markup);
    }

    render(data) {
        try {
            const childEl = this._parentEl.querySelectorAll(
                `.${this._childEl}`
            );

            childEl.length !== 0 && childEl.forEach(child => child.remove());

            this.#data = data;

            this._markup = this.#generateMarkup();
            this._hiddenMarkup = this._addHiddenClass(this._markup);
            const spinner = this._parentEl.querySelectorAll(
                `.${this._spinner}`
            );

            this._parentEl.insertAdjacentHTML('afterbegin', this._hiddenMarkup);
            this._parentEl
                .querySelector(`.${this._childEl}`)
                .classList.remove('hidden');

            if (spinner.length !== 0) spinner.forEach(child => child.remove());
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    _addHiddenClass(markup) {
        const element = parseHTML(markup).querySelector(`.${this._childEl}`);
        element.classList.add('hidden');
        return element.outerHTML;
    }

    #generateMarkup() {
        const { pageNumber, totalPageCount } = this.#data;
        console.log(`pageNumber = ${pageNumber}`);
        console.log(`totalPageCount = ${totalPageCount}`);

        return `
        <div class="${this._childEl}">
            ${
                pageNumber > 1
                    ? `<button class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${pageNumber - 1}</span>
            </button>`
                    : ``
            }
            ${
                pageNumber <= totalPageCount
                    ? `<button class="btn--inline pagination__btn--next">
                <span>Page ${pageNumber + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>`
                    : ``
            }
            
        </div>
        `;
    }
}

export default new PaginationView();
