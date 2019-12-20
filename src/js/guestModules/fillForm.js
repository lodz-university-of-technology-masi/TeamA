const startPng = require('../../icons/play.png');

const { $id } = require('../utils');
const { createOpenQuestion, createClosedQuestion, createNumberQuestion } = require('../common/form');
const { getFormsFromDatabase, sendFilledFormToDatabase } = require('../databaseConnector');
const { validate } = require('../validator');
const Dialogs = require('../common/dialogs');

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
        const listOfQuestions = document.getElementById('fillForm-form-content').children;
        const questions = [];
        for (let i = 0; i < listOfQuestions.length; i++) {
            if (listOfQuestions[i].className === 'form-question form-openQuestion' || listOfQuestions[i].className === 'form-question form-numericalQuestion') {
                const question = {
                    number: i + 1,
                    type: 'O',
                    language: 'EN',
                    content: listOfQuestions[i].children[0].textContent,
                    numberOfAnswers: '|',
                    answers: [],
                    userAnswer: listOfQuestions[i].children[1].value
                };
                questions.push(question);
            } else {
                const questionAnswers = [];
                for (let j = 1; j < listOfQuestions[i].children.length; j++)
                    questionAnswers.push(listOfQuestions[i].children[j].textContent);
                const question = {
                    number: i + 1,
                    type: 'W',
                    language: 'EN',
                    content: listOfQuestions[i].children[0].textContent,
                    numberOfAnswers: listOfQuestions[i].children.length - 1,
                    answers: questionAnswers,
                    userAnswer: document.querySelector(`input[name=showForms-form-question-${i + 1}]:checked`).labels[0].textContent
                };
                questions.push(question);
            }
        }
        const formToBase = { title: form.title, questions, owner: document.getElementById('header-user-label').textContent };
        const validResult = validate.validateFilledForm(formToBase);
        if (validResult.validated) {
            sendFilledFormToDatabase(formToBase);
        } else {
            let warning = 'Uwagi: ';
            for (const validateWarning in validResult.warnings) {
                if (Object.prototype.hasOwnProperty.call(validResult.warnings, validateWarning))
                    warning = `${warning} , ${validateWarning}`;
            }
            Dialogs.alert('Nie poprawny formularz!',
                `Podczas wypełniania formularza wprowadzono dane które nie spełniają wymagań formularza. ${warning}`);
        }
        this.showAll();
    },

    assignEventListeners() {}
};

exports.FillForm = FillForm;
