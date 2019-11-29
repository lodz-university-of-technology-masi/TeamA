
const { $id, $ } = require('../utils');

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

        const users = $id('addUserToForm-users').children;
        for (const el of users)
            el.querySelectorAll('input')[0].checked = false;

        const forms = $id('addUserToForm-forms').children;
        for (const el of forms)
            el.querySelectorAll('input')[0].checked = false;
    },

    chooseSection(no) {
        if (this.chosen === no)
            return;

        if (no === 2)
            this.validate();

        const els = $('.addUserToForm-headerPost');

        if (this.chosen !== null)
            els[this.chosen].setAttribute('name', '');

        $id('addUserToForm-headerLine').style.left =
            `${els[no].offsetLeft}px`;

        $id('addUserToForm-headerLine').style.width =
            `${els[no].offsetWidth}px`;

        els[no].setAttribute('name', 'chosen');
        this.chosen = no;

        for (let i = 0; i < 3; i++) {
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
                $id('addUserToForm-summary-text').innerHTML =
                    `Czy na pewno chcesz dodać ${users.length} użytkownik${users.length === 1 ? 'a' : 'ów'} do formluarza ${form}?`;
                $id('addUserToForm-acceptBtn').setAttribute('name', '');
            } else {
                $id('addUserToForm-summary-text').innerHTML = 'Nie wybrano żadnego formularza!';
                $id('addUserToForm-acceptBtn').setAttribute('name', 'inactive');
            }
        } else {
            $id('addUserToForm-summary-text').innerHTML = 'Nie wybrano żadnego użytkownika!';
            $id('addUserToForm-acceptBtn').setAttribute('name', 'inactive');
        }
    },

    assignEventListeners() {
        for (let i = 0; i < 3; i++) {
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
                this.chooseSection(2);
            });
    }
};

exports.AddUserToForm = AddUserToForm;
