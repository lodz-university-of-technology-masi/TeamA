const { $id, $ } = require('../utils');
const Dialog = require('../common/dialogs');
const {
    getFormsFromDatabase, removeFormFromDatabaseWithoutWarning, sendFormToDatabase,
} = require('../databaseConnector');
const { Wait } = require('../common/wait');

const RemoveUserFromForm = {
    initialized: false,
    chosen: null,
    users: [],
    form: null,

    init() {
        if (this.initialized)
            return;

        getFormsFromDatabase().then(str => {
            const forms = JSON.parse(str);
            this.forms = forms;

            for (const [it, form] of forms.entries()) {
                const div = document.createElement('div');
                div.className = 'removeUserFromForm-selectContainer';

                const inputChild = document.createElement('input');
                inputChild.className = 'removeUserFromForm-formInput';
                inputChild.setAttribute('data-form', it + 1);
                inputChild.name = 'removeUserFromForm-form';
                inputChild.type = 'radio';
                inputChild.id = `removeUserFromForm-form-${it + 1}`;
                div.appendChild(inputChild);

                const labelChild = document.createElement('label');
                labelChild.setAttribute('for', `removeUserFromForm-form-${it + 1}`);
                labelChild.innerText = form.title;
                div.appendChild(labelChild);


                $id('removeUserFromForm-forms').appendChild(div);
            }
        });

        this.initialized = true;
    },

    getUsersFromForm() {
        $id('removeUserFromForm-users').innerHTML = '';

        const users = this.forms[$('.removeUserFromForm-formInput:checked')[0].dataset.form - 1].assignedUsers;
        this.users = users;

        for (const [it, user] of users.entries()) {
            const div = document.createElement('div');
            div.className = 'removeUserFromForm-selectContainer';

            const inputChild = document.createElement('input');
            inputChild.className = 'removeUserFromForm-userInput';
            inputChild.setAttribute('data-user', it + 1);
            inputChild.type = 'checkbox';
            inputChild.id = `removeUserFromForm-user-${it + 1}`;
            div.appendChild(inputChild);

            const labelChild = document.createElement('label');
            labelChild.setAttribute('for', `removeUserFromForm-user-${it + 1}`);
            labelChild.innerText = user;
            div.appendChild(labelChild);


            $id('removeUserFromForm-users').appendChild(div);
        }
    },

    open() {
        if (!this.initialized)
            this.init();

        this.chooseSection(0);
    },

    chooseSection(no) {
        if (this.chosen === no)
            return;

        let idForm;
        if (no === 1) {
            idForm = Array.from($('.removeUserFromForm-formInput')).find(el => {
                if (el.checked)
                    return true;
                return false;
            });

            if (typeof idForm === 'undefined') {
                Dialog.alert(
                    'Brak formluarza',
                    'Nie wybrano formularza!'
                );
                return;
            }

            this.getUsersFromForm();
        }

        const els = $('.removeUserFromForm-headerPost');

        if (this.chosen !== null)
            els[this.chosen].setAttribute('name', '');

        $id('removeUserFromForm-headerLine').style.left =
            `${els[no].offsetLeft}px`;

        $id('removeUserFromForm-headerLine').style.width =
            `${els[no].offsetWidth}px`;

        els[no].setAttribute('name', 'chosen');
        this.chosen = no;

        for (let i = 0; i < 2; i++) {
            if (i === no)
                $id('removeUserFromForm-main').children[i].style.display = 'block';
            else
                $id('removeUserFromForm-main').children[i].style.display = 'none';
        }
    },

    validate() {
        let users = [];
        $('.removeUserFromForm-userInput').forEach(el => {
            if (el.checked)
                users.push(this.users[el.dataset.user - 1]);
        });

        if (users.length !== 0) {
            let idForm = Array.from($('.removeUserFromForm-formInput')).find(el => {
                if (el.checked)
                    return true;
                return false;
            });

            if (typeof idForm !== 'undefined') {
                idForm = idForm.dataset.form;
                Dialog.confirm(
                    'Potwierdzenie',
                    `Czy na pewno chcesz usunąć ${users.length} użytkownik${users.length === 1 ? 'a' : 'ów'} z formluarza ${this.forms[idForm - 1].title}?`,
                    () => {
                        this.clear();
                        this.chooseSection(0);
                        users = users.map(user => user.username);
                        const updatedForm = this.forms[idForm - 1];
                        updatedForm.assignedUsers = users;

                        removeFormFromDatabaseWithoutWarning(updatedForm.formId);
                        sendFormToDatabase(updatedForm);
                        Wait.open();
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
        const users = $id('removeUserFromForm-users').children;
        for (const user of users)
            user.querySelectorAll('input')[0].checked = false;

        const forms = $id('removeUserFromForm-forms').children;
        for (const form of forms)
            form.querySelectorAll('input')[0].checked = false;
    },

    assignEventListeners() {
        for (let i = 0; i < 2; i++) {
            $('.removeUserFromForm-headerPost')[i]
                .addEventListener('click', () => {
                    this.chooseSection(i);
                });
        }

        $id('removeUserFromForm-users-button')
            .addEventListener('click', () => {
                this.validate();
            });

        $id('removeUserFromForm-form-button')
            .addEventListener('click', () => {
                this.chooseSection(1);
            });
    }
};

exports.RemoveUserFromForm = RemoveUserFromForm;
