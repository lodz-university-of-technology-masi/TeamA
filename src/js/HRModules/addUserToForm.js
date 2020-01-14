const { $id, $ } = require('../utils');
const Dialog = require('../common/dialogs');
const {
    getFormsFromDatabase, removeFormFromDatabaseWithoutWarning, sendFormToDatabase, getUsers
} = require('../databaseConnector');
const { Wait } = require('../common/wait');

const AddUserToForm = {
    initialized: false,
    chosen: null,
    users: [],
    form: null,

    init() {
        if (this.initialized)
            return;

        getUsers().then(str => {
            const users = JSON.parse(str);
            this.users = users;

            for (const [it, user] of users.entries()) {
                const div = document.createElement('div');
                div.className = 'addUserToForm-selectContainer';

                const inputChild = document.createElement('input');
                inputChild.className = 'addUserToForm-userInput';
                inputChild.setAttribute('data-user', it + 1);
                inputChild.type = 'checkbox';
                inputChild.id = `addUserToForm-user-${it + 1}`;
                div.appendChild(inputChild);

                const labelChild = document.createElement('label');
                labelChild.setAttribute('for', `addUserToForm-user-${it + 1}`);
                labelChild.innerText = user.username;
                div.appendChild(labelChild);


                $id('addUserToForm-users').appendChild(div);
            }
        });

        getFormsFromDatabase().then(str => {
            const forms = JSON.parse(str);
            this.forms = forms;

            for (const [it, form] of forms.entries()) {
                const div = document.createElement('div');
                div.className = 'addUserToForm-selectContainer';

                const inputChild = document.createElement('input');
                inputChild.className = 'addUserToForm-formInput';
                inputChild.setAttribute('data-form', it + 1);
                inputChild.name = 'addUserToForm-form';
                inputChild.type = 'radio';
                inputChild.id = `addUserToForm-form-${it + 1}`;
                div.appendChild(inputChild);

                const labelChild = document.createElement('label');
                labelChild.setAttribute('for', `addUserToForm-form-${it + 1}`);
                labelChild.innerText = form.title;
                div.appendChild(labelChild);


                $id('addUserToForm-forms').appendChild(div);
            }
        });

        this.initialized = true;
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
        let users = [];
        $('.addUserToForm-userInput').forEach(el => {
            if (el.checked)
                users.push(this.users[el.dataset.user - 1]);
        });

        if (users.length !== 0) {
            let idForm = Array.from($('.addUserToForm-formInput')).find(el => {
                if (el.checked)
                    return true;
                return false;
            });

            if (typeof idForm !== 'undefined') {
                idForm = idForm.dataset.form;
                Dialog.confirm(
                    'Potwierdzenie',
                    `Czy na pewno chcesz dodać ${users.length} użytkownik${users.length === 1 ? 'a' : 'ów'} do formluarza ${this.forms[idForm - 1].title}?`,
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
