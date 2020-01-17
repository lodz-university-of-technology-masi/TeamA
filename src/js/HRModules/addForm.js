const { sendFormToDatabase } = require('../databaseConnector');
const { $id } = require('../utils');
const Dialogs = require('../common/dialogs');
const {
    createOpenQuestion,
    createClosedQuestion,
    createNumberQuestion
} = require('../HRModules/newForm');
const { Validate } = require('../validator');
const { getOneSynonym, getSynonyms, getLanguages } = require('../common/yandex');

let focused;


const AddForm = {
    questions: [],

    getText(elem) {
        if(elem.tagName === "INPUT" && elem.type === "text") {
            return elem.value.substring(elem.selectionStart,
                    elem.selectionEnd);
        }
        return null;
    },

    findSynonym() {
        Promise.resolve(getOneSynonym(focused))
            .then(str => {
                if (str.length === 0) {
                    Dialogs.alert('Bład', 'Nie ma takiego słowa w bazie');
                    return;
                }
                const firstSynonym = str[0].tr[0].text;
                Promise.resolve(getSynonyms(firstSynonym))
                    .then(tab => {
                        let synonyms = '';
                        for (speech_parts of tab) {
                            if (speech_parts.tr[0].syn) {
                                for (obj of speech_parts.tr[0].syn) {
                                    synonyms += obj.text + ', '
                                }
                            }
                            else Dialogs.alert('Błąd', 'Nasza baza nie ma synonimów dla tego słowa');
                        }
                        if (synonyms) Dialogs.alert('Synonimy : ', synonyms);
                        else Dialogs.alert('Błąd', 'Nasza baza nie ma synonimów dla tego słowa');
                    });
            });
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

        $id('addForm-form-content').appendChild(dom);
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

        $id('addForm-form-content').appendChild(closedObject.dom);
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

        $id('addForm-form-content').appendChild(dom);
    },

    checkClear() {
        if (this.questions.length !== 0) {
            Dialogs.confirm(
                'Czyszczenie formy',
                'Czy na pewno wyczyścić formularz?',
                () => {
                    AddForm.clear();
                }
            );
        }
    },

    clear() {
        $id('addForm-form-content').innerHTML = '';
        this.questions = [];
    },

    check() {
        const wrong = [];

        if (this.questions.length === 0) {
            Dialogs.alert(
                'Tworzenie formularza',
                'Nie można stworzyć formularza bez pytań'
            );
        } else {
            for (const [it, question] of this.questions.entries()) {
                if (question.type === 'o' || question.type === 'l') {
                    const value = question.dom.querySelectorAll('div > input')[0]
                        .value.trim();

                    if (value.length < 1) {
                        wrong.push(it + 1);
                        continue;
                    }
                } else {
                    const inputValue = question.dom
                        .querySelectorAll('div > input')[0].value.trim();

                    if (inputValue.length < 1) {
                        wrong.push(it + 1);
                        continue;
                    }

                    const optionInputs = question.dom
                        .querySelectorAll('label > input[type="text"]');

                    for (const option of optionInputs) {
                        const optionValue = option.value.trim();

                        if (optionValue.length < 1) {
                            wrong.push(it + 1);
                            break;
                        }
                    }
                }
            }

            if (wrong.length > 0) {
                Dialogs.alert(
                    'Tworzenie formularza',
                    `Pytani${wrong.length === 1 ? 'e' : 'a'} o numer${wrong.length === 1 ? 'ze' : 'ach'} ${wrong.toString()} nie są poprawne`
                );
            } else {
                this.saveFormToDataBase();
            }
        }
    },

    saveFormToDataBase() {
        const questions = [];
        const doc = document.getElementById('addForm-form-content').children;
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
        const formToBase = { title: document.getElementById('addForm-form-title').children[0].value, questions, assignedUsers: [] };
        const validationData = Validate.validateForm(formToBase);
        if (validationData.validated) {
            sendFormToDatabase(formToBase);
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
    },

  

    

    assignEventListeners() {
        $id('addForm-synonym-button')
            .addEventListener('click', () => {
                AddForm.findSynonym();
                focused = null;
            });

        $id('add-form-openBtn')
            .addEventListener('click', () => {
                AddForm.addOpenQuestion();
            });

        $id('add-form-closedBtn')
            .addEventListener('click', () => {
                AddForm.addClosedQuestion();
            });

        $id('add-form-numberBtn')
            .addEventListener('click', () => {
                AddForm.addNumericalQuestion();
            });

        $id('addForm-form-buttons-back')
            .addEventListener('click', () => {
                AddForm.checkClear();
            });

        $id('addForm-form-buttons-apply')
            .addEventListener('click', () => {
                AddForm.check();
            });
    }
};


exports.initAddForm = () => {
    setInterval(function () {
        if (document.activeElement.tagName !== 'BUTTON') {
            let temp = AddForm.getText(document.activeElement);
            if (temp) {
                focused = temp;
            }
        }
    }, 100);
}

exports.AddForm = AddForm;
