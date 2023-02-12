import icons from '../../img/icons.svg';
import { TIMEOUT_SEC } from '../config';
import { timeout } from '../helpers';
import View from './View';

class BookmarksView extends View {
    _parentEl = document.querySelector('.bookmarks');
    _childEl = `bookmarks__list`;
    _errorMessage = `recipe 😐`;
    _messageText = `No bookmarks yet. Find a nice recipe and bookmark it :)`;
    _data;

    async render(data) {
        try {
            console.log(this._data);
            const childEl = this._parentEl.querySelectorAll(
                `.${this._childEl}`
            );
            childEl.length !== 0 && childEl.forEach(child => child.remove());

            this._data = data;

            const spinner = this._parentEl.querySelectorAll(
                `.${this._spinner}`
            );

            this._markup = this._generateMarkup();
            this._hiddenMarkup = this._addHiddenClass(this._markup);
            this._parentEl.insertAdjacentHTML('beforeend', this._hiddenMarkup);

            await Promise.race([
                Promise.all(
                    this._downloadImages(
                        Array.from(
                            this._parentEl.querySelectorAll(`.preview__fig img`)
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

    _generateMarkup() {
        const { searchParams } = new URL(window.location);
        const idFromURL = searchParams.get('id');

        if (Array.isArray(this._data))
            return `
            <ul class="${this._childEl}">
                ${this._data
                    .map(
                        ({ id, imageUrl, title, publisher }) => `
                        <li class="preview">
                            <a class="preview__link ${
                                idFromURL === id ? 'preview__link--active' : ''
                            }" href="?id=${id}">
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
                                            <use href="${icons}#icon-user"></use>
                                        </svg>
                                    </div>
                                </div>
                            </a>
                        </li>`
                    )
                    .join('')}
            </ul>
        `;

        if (!Array.isArray(this._data)) {
            const { id, imageUrl, title, publisher } = this._data;

            return `<ul class="${this._childEl}">
                    <li class="preview">
                        <a class="preview__link ${
                            idFromURL === id ? 'preview__link--active' : ''
                        }" href="?id=${id}">
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
                                        <use href="${icons}#icon-user"></use>
                                    </svg>
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>`;
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
}

export default new BookmarksView();
