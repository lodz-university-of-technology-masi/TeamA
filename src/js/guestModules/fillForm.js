const startPng = require('../../icons/play.png');

const { $id } = require('../utils');
const { createOpenQuestion, createClosedQuestion, createNumberQuestion } = require('../common/form');
const { getFormsFromDatabase } = require('../databaseConnector');

const FillForm = {
    initialized: false,
    active: false,

    init() {
        this.initialized = true;

        Promise.resolve(getFormsFromDatabase())
            .then(str => {
                const forms = JSON.parse(str);

                for (const [it, form] of forms.entries()) {
                    const div = document.createElement('div');

                    let child = document.createElement('div');
                    child.innerHTML = (it + 1);
                    div.appendChild(child);

                    child = document.createElement('div');
                    child.innerHTML = form.title;
                    div.appendChild(child);

                    child = document.createElement('div');
                    child.innerHTML = form.questions.length;
                    div.appendChild(child);

                    child = document.createElement('div');

                    const img = new Image();
                    img.src = startPng;
                    img.onclick = () => {
                        this.show(form);
                    };
                    child.appendChild(img);

                    div.appendChild(child);
                    $id('fillForm-list-table').appendChild(div);
                }

                this.showAll();

                $id('fillForm-content-loading').remove();
            });
    },

    open() {
        if (!this.initialized)
            this.init();
    },

    showAll() {
        $id('fillForm-list').style.display = 'block';
        $id('fillForm-fill').style.display = 'none';
    },

    show(which) {
        this.active = true;
        $id('fillForm-back').style.visibility = 'hidden';

        $id('fillForm-list').style.display = 'none';
        $id('fillForm-fill').style.display = 'block';

        $id('fillForm-form-title').innerHTML = which.title;
        $id('fillForm-form-content').innerHTML = '';

        for (const question of which.questions) {
            if (question.type.toLowerCase() === 'o') {
                $id('fillForm-form-content')
                    .appendChild(createOpenQuestion(question.number, question.content));
            } else if (question.type.toLowerCase() === 'w') {
                $id('fillForm-form-content')
                    .appendChild(
                        createClosedQuestion(question.number,
                            question.content,
                            question.answers)
                    );
            } else if (question.type.toLowerCase() === 'l') {
                $id('fillForm-form-content')
                    .appendChild(createNumberQuestion(question.number, question.content));
            }
        }

        $id('fillForm-form-buttons-finish').onclick = () => {
            this.finish(which);
        };
    },

    finish(form) {
        this.active = false;
        $id('fillForm-back').style.visibility = 'visible';
        // TODO: tutaj przetwarzanie formy
        console.log(form);
        this.showAll();
    },

    assignEventListeners() {}
};

exports.FillForm = FillForm;
