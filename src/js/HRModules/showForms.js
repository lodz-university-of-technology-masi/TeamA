const eyePng = require('../../icons/eye.png');
const pencilPng = require('../../icons/pencil.png');
const deletePng = require('../../icons/delete.png');
const downloadPng = require('../../icons/download.png');

const {
    $id
} = require('../utils');
const sf = require('../common/form');
const {
    createOpenQuestion,
    createClosedQuestion,
    createNumberQuestion
} = require('./newForm');
const {
    editOpenQuestion,
    editClosedQuestion,
    editNumberQuestion,
    overwriteForm
} = require('./editForm');

const Dialogs = require('../common/dialogs');

const {
    getFormsFromDatabase,
    removeFormFromDatabase
} = require('../databaseConnector');
const csvManager = require('../csvManager');

const ShowForms = {
    initialized: false,
    backToList: true,
    form: null,
    questions: [],

    init() {
        this.initialized = true;

        Promise.resolve(getFormsFromDatabase()).then(str => {
            const forms = JSON.parse(str);

            for (const [it, form] of forms.entries()) {
                const div = document.createElement('div');

                let child = document.createElement('div');
                child.innerHTML = it + 1;
                div.appendChild(child);

                child = document.createElement('div');
                child.innerHTML = form.title;
                div.appendChild(child);

                child = document.createElement('div');
                child.innerHTML = form.questions.length;
                div.appendChild(child);

                child = document.createElement('div');
                let img = new Image();
                img.src = eyePng;
                img.onclick = () => {
                    this.show(form);
                    this.form = form;
                };
                child.appendChild(img);
                div.appendChild(child);

                child = document.createElement('div');
                img = new Image();
                img.src = pencilPng;
                img.onclick = () => {
                    this.edit(form);
                    this.backToList = true;
                    this.form = form;
                };
                child.appendChild(img);
                div.appendChild(child);

                child = document.createElement('div');
                img = new Image();
                img.src = downloadPng;
                img.onclick = () => {
                    csvManager.saveCsv(form);
                };
                child.appendChild(img);
                div.appendChild(child);

                child = document.createElement('div');
                img = new Image();
                img.src = deletePng;
                img.onclick = () => {
                    Dialogs.confirm(
                        'Usuwanie formularza',
                        'Czy na pewno chcesz usunąć ten formluarz? Tego nie da się cofnąć!',
                        () => {
                            removeFormFromDatabase(form.formId);
                        }
                    );
                };
                child.appendChild(img);

                div.appendChild(child);

                $id('showForms-list-table').appendChild(div);
            }

            this.showAll();

            $id('showForms-content-loading').remove();
        });
    },

    open() {
        if (!this.initialized) this.init();
        else this.showAll();
    },

    showAll() {
        $id('showForms-list').style.display = 'block';
        $id('showForms-form').style.display = 'none';
        $id('showForms-edit').style.display = 'none';
    },

    show(which) {
        $id('showForms-list').style.display = 'none';
        $id('showForms-form').style.display = 'block';

        $id('showForms-form-title').innerHTML = which.title;
        $id('showForms-form-content').innerHTML = '';

        for (const question of which.questions) {
            if (question.type.toLowerCase() === 'o') {
                $id('showForms-form-content').appendChild(
                    sf.createOpenQuestion(question.number, question.content)
                );
            } else if (question.type.toLowerCase() === 'w') {
                $id('showForms-form-content').appendChild(
                    sf.createClosedQuestion(
                        question.number,
                        question.content,
                        question.answers
                    )
                );
            } else if (question.type.toLowerCase() === 'l') {
                $id('showForms-form-content').appendChild(
                    sf.createNumberQuestion(question.number, question.content)
                );
            }
        }
    },

    edit(which) {
        $id('showForms-list').style.display = 'none';
        $id('showForms-form').style.display = 'none';
        $id('showForms-edit').style.display = 'block';

        $id('showForms-edit-title-input').value = which.title;
        $id('showForms-edit-content').innerHTML = '';

        for (const question of which.questions) {
            if (question.type.toLowerCase() === 'o') {
                const q = {};

                const number = this.questions.length + 1;
                const dom = editOpenQuestion(number, question.content, () => {
                    this.removeQuestion(q);
                });

                q.type = 'o';
                q.dom = dom;

                this.questions.push(q);

                $id('showForms-edit-content').appendChild(dom);
            } else if (question.type.toLowerCase() === 'w') {
                const q = {};

                const number = this.questions.length + 1;
                const closedObject = editClosedQuestion(number,
                    question.content,
                    question.answers,
                    () => {
                        this.removeQuestion(q);
                    });

                q.type = 'w';
                q.commonName = closedObject.commonName;
                q.dom = closedObject.dom;
                q.answers = closedObject.answers;

                this.questions.push(q);

                $id('showForms-edit-content').appendChild(closedObject.dom);
            } else if (question.type.toLowerCase() === 'l') {
                const q = {};

                const number = this.questions.length + 1;
                const dom = editNumberQuestion(number, question.content, () => {
                    this.removeQuestion(q);
                });

                q.type = 'l';
                q.dom = dom;

                this.questions.push(q);

                $id('showForms-edit-content').appendChild(dom);
            }
        }
    },

    removeQuestion(question) {
        const myIndex = this.questions.indexOf(question);

        if (myIndex > -1) {
            this.questions.splice(myIndex, 1);

            const limit = this.questions.length;
            for (let i = myIndex; i < limit; i++) {
                this.questions[i].dom.querySelectorAll('p')[0]
                    .innerHTML = `${i + 1}. `;
            }

            question.dom.remove();
        }
    },

    addOpenQuestion() {
        const question = {};

        const number = this.questions.length + 1;
        const dom = createOpenQuestion(number, () => {
            this.removeQuestion(question);
        });

        question.type = 'o';
        question.dom = dom;

        this.questions.push(question);

        $id('showForms-edit-content').appendChild(dom);
    },

    addClosedQuestion() {
        const question = {};

        const number = this.questions.length + 1;
        const closedObject = createClosedQuestion(number, () => {
            this.removeQuestion(question);
        });

        question.type = 'w';
        question.commonName = closedObject.commonName;
        question.dom = closedObject.dom;
        question.answers = closedObject.answers;

        this.questions.push(question);

        $id('showForms-edit-content').appendChild(closedObject.dom);
    },

    addNumericalQuestion() {
        const question = {};

        const number = this.questions.length + 1;
        const dom = createNumberQuestion(number, () => {
            this.removeQuestion(question);
        });

        question.type = 'l';
        question.dom = dom;

        this.questions.push(question);

        $id('showForms-edit-content').appendChild(dom);
    },

    assignEventListeners() {
        $id('edit-form-openBtn')
            .addEventListener('click', () => {
                ShowForms.addOpenQuestion();
            });

        $id('edit-form-closedBtn')
            .addEventListener('click', () => {
                ShowForms.addClosedQuestion();
            });

        $id('edit-form-numberBtn')
            .addEventListener('click', () => {
                ShowForms.addNumericalQuestion();
            });

        $id('showForms-form-buttons-back').addEventListener('click', () => {
            this.showAll();
        });

        $id('showForms-edit-buttons-apply').addEventListener('click', () => {
            overwriteForm(this.form);
        });
    }
};

exports.ShowForms = ShowForms;
