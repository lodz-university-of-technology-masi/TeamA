const {
    removeFormFromDatabaseWithoutWarning,
    sendFormToDatabase
} = require('../databaseConnector');
const {
    Wait
} = require('../common/wait');

const removeImage = require('../../icons/delete.png');
const remove2Image = require('../../icons/close.png');

const {
    Validate
} = require('../validator');
const Dialogs = require('../common/dialogs');

exports.editOpenQuestion = (number, question, removeCallback) => {
    const div = document.createElement('div');
    div.classList.add('newForm-question');
    div.classList.add('newForm-openQuestion');

    const row = document.createElement('div');

    const p = document.createElement('p');
    p.innerHTML = `${number}. `;
    row.appendChild(p);

    const pInput = document.createElement('input');
    pInput.value = question;
    pInput.placeholder = question;
    row.appendChild(pInput);

    const image = new Image();
    image.src = removeImage;
    image.onclick = removeCallback;
    row.appendChild(image);

    div.appendChild(row);

    const input = document.createElement('input');
    input.placeholder = 'Odpowiedź uczestnika na pytanie otwarte';
    input.disabled = true;
    div.appendChild(input);

    return div;
};

function editClosedOption(which, commonName, answerQuestion, removeCallback) {
    const label = document.createElement('label');
    label.for = `showForms-form-question-${which}`;

    const input = document.createElement('input');
    input.id = `showForms-form-question-${which}`;
    input.name = commonName;
    input.type = 'radio';
    input.disabled = true;
    label.appendChild(input);

    const child = document.createElement('div');
    label.appendChild(child);

    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.value = `${answerQuestion[which - 1]}`;
    questionInput.placeholder = `${answerQuestion[which - 1]}`;
    label.appendChild(questionInput);

    if (which !== 1 && which !== 2) {
        const image = new Image();
        image.src = remove2Image;
        image.onclick = removeCallback;
        label.appendChild(image);
    }

    return label;
}

function addClosedOption(which, commonName, removeCallback) {
    const label = document.createElement('label');
    label.for = `showForms-form-question-${which}`;

    const input = document.createElement('input');
    input.id = `showForms-form-question-${which}`;
    input.name = commonName;
    input.type = 'radio';
    input.disabled = true;
    label.appendChild(input);

    const child = document.createElement('div');
    label.appendChild(child);

    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.placeholder = `Opcja #${which}`;
    label.appendChild(questionInput);

    if (which !== 1 && which !== 2) {
        const image = new Image();
        image.src = remove2Image;
        image.onclick = removeCallback;
        label.appendChild(image);
    }

    return label;
}

exports.editClosedQuestion = (number, question, answersQuestion, removeCallback) => {
    const div = document.createElement('div');
    div.classList.add('newForm-question');
    div.classList.add('newForm-closedQuestion');

    const row = document.createElement('div');

    const p = document.createElement('p');
    p.innerHTML = `${number}. `;
    row.appendChild(p);

    const pInput = document.createElement('input');
    pInput.value = question;
    pInput.placeholder = question;
    row.appendChild(pInput);

    const image = new Image();
    image.src = removeImage;
    image.onclick = removeCallback;
    row.appendChild(image);

    div.appendChild(row);

    const answersArea = document.createElement('div');
    answersArea.classList.add('newForm-closedQuestion-answers');

    const answers = [];
    const commonName = `showForms-form-question-${number}`;
    for (let i = 1; i < answersQuestion.length + 1; i++) {
        const answer = {};

        let dom;
        if (i > 2)
            dom = editClosedOption(i, commonName, answersQuestion, removeCallback);
        else
            dom = editClosedOption(i, commonName, answersQuestion);

        answer.number = i;
        answer.dom = dom;

        answers.push(answer);
        answersArea.appendChild(dom);
    }

    div.appendChild(answersArea);

    const button = document.createElement('button');
    button.innerHTML = 'Dodaj opcję';
    button.onclick = () => {
        if (answers.length === 4)
            return;

        const answer = {};

        const answerNumber = answers.length + 1;
        const dom = addClosedOption(answerNumber, commonName, () => {
            const myIndex = answers.indexOf(answer);

            if (myIndex > -1) {
                answers.splice(myIndex, 1);

                const limit = answers.length;
                for (let i = myIndex; i < limit; i++) {
                    answers[i].dom.querySelectorAll('input')[0]
                        .id = `showForms-form-question-${i + 1}`;

                    answers[i].dom.querySelectorAll('input')[1]
                        .placeholder = `Opcja #${i + 1}`;
                }

                dom.remove();

                button.style.visibility = 'visible';
            }
        });

        answer.dom = dom;

        answers.push(answer);
        answersArea.appendChild(dom);

        if (answers.length === 4)
            button.style.visibility = 'hidden';
    };
    div.appendChild(button);

    return {
        commonName,
        answers,
        dom: div
    };
};

exports.editNumberQuestion = (number, question, removeCallback) => {
    const div = document.createElement('div');
    div.classList.add('newForm-question');
    div.classList.add('newForm-numericalQuestion');

    const row = document.createElement('div');

    const p = document.createElement('p');
    p.innerHTML = `${number}. `;
    row.appendChild(p);

    const pInput = document.createElement('input');
    pInput.value = question;
    pInput.placeholder = question;
    row.appendChild(pInput);

    const image = new Image();
    image.src = removeImage;
    image.onclick = removeCallback;
    row.appendChild(image);

    div.appendChild(row);

    const input = document.createElement('input');
    input.placeholder = 'Odpowiedź uczestnika na pytanie liczbowe';
    input.disabled = true;
    div.appendChild(input);

    return div;
};

exports.overwriteForm = (form, callback) => {
    const questions = [];
    const doc = document.getElementById('showForms-edit-content').children;
    for (let i = 0; i < doc.length; i++) {
        if (doc[i].className === 'newForm-question newForm-openQuestion') {
            const question = {
                number: i + 1,
                type: 'O',
                language: 'EN',
                content: doc[i].children[0].children[1].value,
                numberOfAnswers: '|',
                answers: []
            };
            questions.push(question);
        } else if (doc[i].className === 'newForm-question newForm-numericalQuestion') {
            const question = {
                number: i + 1,
                type: 'L',
                language: 'EN',
                content: doc[i].children[0].children[1].value,
                numberOfAnswers: '|',
                answers: []
            };
            questions.push(question);
        } else {
            const formAnswers = [];
            const answer = doc[i].children[1].children;
            for (let p = 0; p < answer.length; p++)
                formAnswers.push(answer[p].children[2].value);
            const question = {
                number: i + 1,
                type: 'W',
                language: 'EN',
                content: doc[i].children[0].children[1].value,
                numberOfAnswers: doc[i].children[1].children.length,
                answers: formAnswers
            };
            questions.push(question);
        }
    }
    const formToBase = {
        title: document.getElementById('showForms-edit-title').children[0].value,
        questions,
        assignedUsers: []
    };
    const validationData = Validate.validateForm(formToBase);
    if (validationData.validated) {
        Wait.open();
        removeFormFromDatabaseWithoutWarning(form.id, () => {
            sendFormToDatabase(formToBase, () => {
                callback();
            });
        });
    } else {
        let generalWarning = 'Uwagi: ';
        const validateWarnings = validationData.warnings;
        for (let i = 0; i < validateWarnings.length; i++) {
            generalWarning += `${validateWarnings[i]},`;
        }
        generalWarning = `${generalWarning}  wymagają poprawek.`;
        Dialogs.alert('Nie poprawny formularz!',
            `Podczas tworzenia formularza wprowadzono dane które nie spełniają wymagań formularza. ${generalWarning}`);
    }
};
