import { getValidProperties } from '../helpers';

class AddRecipeView {
    _parentEl = document.querySelector('.nav__btn--add-recipe');
    _modal = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _form = 'upload';

    constructor() {}

    openModal() {
        if (
            this._modal.classList.contains('hidden') ||
            this._overlay.classList.contains('hidden')
        ) {
            this._modal.classList.remove('hidden');
            this._overlay.classList.remove('hidden');
        }
    }

    closeModal() {
        if (
            !this._modal.classList.contains('hidden') ||
            !this._overlay.classList.contains('hidden')
        ) {
            this._modal.classList.add('hidden');
            this._overlay.classList.add('hidden');
        }
    }

    addHandlerOnSubmit(handler) {
        this._modal
            .querySelector(`.${this._form}`)
            .addEventListener('click', e => {
                const btn = e.target.closest('.upload__btn');
                if (!btn) return;

                const inputs = Object.fromEntries(
                    new FormData(e.target.closest('.upload')).entries()
                );

                handler.call(this, inputs);
            });
    }

    addHandlerOpenModal() {
        this._parentEl.addEventListener('click', this.openModal.bind(this));
    }

    addHandlerCloseModal() {
        this._modal.addEventListener('click', e => {
            e.preventDefault();

            if (e.target.closest('.btn--close-modal')) this.closeModal();
        });
        this._overlay.addEventListener('click', this.closeModal.bind(this));
    }
}

export default new AddRecipeView();
