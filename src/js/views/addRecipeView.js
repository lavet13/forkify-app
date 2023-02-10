class AddRecipeView {
    _btn = document.querySelector('.nav__btn--add-recipe');
    _parentEl = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _form = 'upload';

    constructor() {
        this._addHandlerOpenModal();
        this._addHandlerCloseModal();
    }

    openModal() {
        if (
            this._parentEl.classList.contains('hidden') ||
            this._overlay.classList.contains('hidden')
        ) {
            this._parentEl.classList.remove('hidden');
            this._overlay.classList.remove('hidden');
        }
    }

    closeModal() {
        if (
            !this._parentEl.classList.contains('hidden') ||
            !this._overlay.classList.contains('hidden')
        ) {
            this._parentEl.classList.add('hidden');
            this._overlay.classList.add('hidden');
        }
    }

    addHandlerOnSubmit(handler) {
        this._parentEl
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

    _addHandlerOpenModal() {
        this._btn.addEventListener('click', this.openModal.bind(this));
    }

    _addHandlerCloseModal() {
        this._parentEl.addEventListener('click', e => {
            e.preventDefault();

            if (e.target.closest('.btn--close-modal')) this.closeModal();
        });
        this._overlay.addEventListener('click', this.closeModal.bind(this));
    }
}

export default new AddRecipeView();
