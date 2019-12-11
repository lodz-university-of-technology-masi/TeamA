
const { $id, $ } = require('../utils');
const Dialog = require('../common/dialogs');

const AddUserToForm = {
    initialized: false,
    chosen: null,

    init() {
        if (this.initialized)
            return;

        this.initialized = true;

        this.chooseSection(0);
    },

    open() {
        if (!this.initialized)
            this.init();

        this.chooseSection(0);
    },

    chooseSection(no) {
        if (this.chosen === no)
            return;

        const els = $('.addUserToForm-headerPost');

        if (this.chosen !== null)
            els[this.chosen].setAttribute('name', '');

        $id('addUserToForm-headerLine').style.left =
            `${els[no].offsetLeft}px`;

        $id('addUserToForm-headerLine').style.width =
            `${els[no].offsetWidth}px`;

        els[no].setAttribute('name', 'chosen');
        this.chosen = no;

        for (let i = 0; i < 2; i++) {
            if (i === no)
                $id('addUserToForm-main').children[i].style.display = 'block';
            else
                $id('addUserToForm-main').children[i].style.display = 'none';
        }
    },

    validate() {
        const users = [];
        $('.addUserToForm-userInput').forEach(el => {
            if (el.checked)
                users.push(el.dataset.user);
        });

        if (users.length !== 0) {
            let form = Array.from($('.addUserToForm-formInput')).find(el => {
                if (el.checked)
                    return true;
                return false;
            });

            if (typeof form !== 'undefined') {
                form = form.dataset.form;
                Dialog.confirm(
                    'Potwierdzenie',
                    `Czy na pewno chcesz dodać ${users.length} użytkownik${users.length === 1 ? 'a' : 'ów'} do formluarza ${form}?`,
                    () => {
                        this.clear();
                        this.chooseSection(0);
                        // Zgoda
                    }
                );
            } else {
                Dialog.alert(
                    'Brak formluarza',
                    'Nie wybrano formularza!'
                );
            }
        } else {
            Dialog.alert(
                'Brak użytkownika',
                'Nie wybrano żadnego użytkownika!'
            );
        }
    },

    clear() {
        const users = $id('addUserToForm-users').children;
        for (const user of users)
            user.querySelectorAll('input')[0].checked = false;

        const forms = $id('addUserToForm-forms').children;
        for (const form of forms)
            form.querySelectorAll('input')[0].checked = false;
    },

    assignEventListeners() {
        for (let i = 0; i < 2; i++) {
            $('.addUserToForm-headerPost')[i]
                .addEventListener('click', () => {
                    this.chooseSection(i);
                });
        }

        $id('addUserToForm-users-button')
            .addEventListener('click', () => {
                this.chooseSection(1);
            });

        $id('addUserToForm-form-button')
            .addEventListener('click', () => {
                this.validate();
            });
    }
};

exports.AddUserToForm = AddUserToForm;
