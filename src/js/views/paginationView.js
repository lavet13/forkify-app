import icons from '../../img/icons.svg';
import View from './View';

class PaginationView extends View {
    _parentEl = document.querySelector('.pagination');
    _childEl = `buttons`;
    _errorMessage = `Something went wrong with buttons :(`;
    _id = 'ac1f4d84-3402-f04d-c36d-1ea3761e8018';
    _data;

    render(data) {
        try {
            const childEl = this._parentEl.querySelectorAll(
                `.${this._childEl}`
            );

            childEl.length !== 0 && childEl.forEach(child => child.remove());

            this._data = data;

            this._markup = this._generateMarkup();
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

    _generateMarkup() {
        const { pageNumber, totalPageCount } = this._data;
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
