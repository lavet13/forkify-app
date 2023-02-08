import icons from '../../img/icons.svg';
import { TIMEOUT_SEC } from '../config';
import { timeout } from '../helpers';
import View from './View';

class ResultsView extends View {
    _parentEl = document.querySelector('.search-results');
    _childEl = 'results';
    _errorMessage = `No such recipes to be found!`;
    _id = 'dbabfec5-dcc0-127a-24a0-22e42cbd7441';
    _data;

    async render(data) {
        try {
            const childEl = this._parentEl.querySelectorAll(
                `.${this._childEl}`
            );

            childEl.length !== 0 && childEl.forEach(child => child.remove());

            this._data = data;

            if (this._data.length === 0) throw new Error(this._errorMessage);

            this._markup = this._generateMarkup();
            this._hiddenMarkup = this._addHiddenClass(this._markup);
            const spinner = this._parentEl.querySelectorAll(
                `.${this._spinner}`
            );

            this._parentEl.insertAdjacentHTML('afterbegin', this._hiddenMarkup);

            await Promise.race([
                Promise.all(
                    this._downloadImages(
                        Array.from(
                            this._parentEl.querySelectorAll('.preview__fig img')
                        )
                    )
                ),
                timeout(TIMEOUT_SEC),
            ]);

            this._parentEl
                .querySelector(`.${this._childEl}`)
                .classList.remove('hidden');

            if (spinner.length !== 0) spinner.forEach(child => child.remove());
        } catch (err) {
            throw err;
        }
    }

    _downloadImages(images) {
        return images.map(
            image =>
                new Promise((resolve, reject) => {
                    image.addEventListener('load', () => {
                        resolve(image);
                    });

                    image.addEventListener('error', () => {
                        reject(new Error('Cannot download the image'));
                    });
                })
        );
    }

    _generateMarkup() {
        const { searchParams } = new URL(window.location);
        const idFromURL = searchParams.get('id');

        return `
            <ul class="${this._childEl}">
            ${this._data
                .map(
                    ({ id, imageUrl, publisher, title }) =>
                        `
                    <li class="preview">
                        <a
                            class="preview__link ${
                                id === idFromURL ? 'preview__link--active' : ''
                            }"
                            href="?id=${id}"
                        >
                            <figure class="preview__fig">
                                <img src="${imageUrl}" alt="${title}" />
                            </figure>
                            <div class="preview__data">
                                <h4 class="preview__title">
                                    ${title}
                                </h4>
                                <p class="preview__publisher">
                                    ${publisher}
                                </p>
                                <div class="preview__user-generated">
                                    <svg>
                                        <use
                                            href="${icons}#icon-user"
                                        ></use>
                                    </svg>
                                </div>
                            </div>
                        </a>
                    </li>
                `
                )
                .join('')}
            </ul>
        `;
    }
}

export default new ResultsView();
