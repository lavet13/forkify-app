import View from './View';

class PaginationView extends View {
    _parentEl = document.querySelector('.pagination');
    _paramSearch = 'page';
    #data;

    constructor() {
        super();
    }

    getQuery(target) {
        const button = target.closest('.btn__inline');
        const { searchParams } = new URL(window.location);
        const paramValue = searchParams.get(this._paramSearch);

        if (!this._isValidQuery(paramValue) && !this._isValidDOMElement(button))
            return false;

        if (button.classList.contains('pagination__btn--next')) {
            return ++paramValue;
        }

        if (button.classList.contains('pagination__btn--prev')) {
            return --paramValue;
        }
    }

    _isValidDOMElement(button) {
        if (!button) return false;
    }

    _isValidQuery(paramValue) {
        if (paramValue < 2) return false;

        if (!Number.isFinite(paramValue))
            throw { err: new Error('Invalid page request!'), view: this };
    }

    addHandlerRender(handler) {
        this._parentEl.addEventListener('click', e => {
            e.preventDefault();

            handler.call(this, e);
        });
    }

    render(data) {
        this.#data = data;

        const markup = this.#generateMarkup();

        document
            .querySelector('.results')
            .insertAdjacentHTML('afterend', markup);
    }

    #generateMarkup() {
        return `<div class="pagination">${
            this.#data !== 1
                ? `<button class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="src/img/icons.svg#icon-arrow-left"></use>
                </svg>
                <span>Page ${this.#data - 1}</span>
            </button>`
                : ``
        }
            <button class="btn--inline pagination__btn--next">
                <span>Page ${this.#data + 1}</span>
                <svg class="search__icon">
                    <use href="src/img/icons.svg#icon-arrow-right"></use>
                </svg>
            </button>
        </div>`;
    }
}

export default new PaginationView();
