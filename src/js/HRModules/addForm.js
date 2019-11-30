
const { $id } = require('../utils');

const AddForm = {
    open() {
        $id('addForm-formName').value = '';
        $id('addForm-questionList').innerHTML = '';
    },

    addNewOpenQuestion() {
        const main = $id('addForm-questionList');
        const openQuestion = document.createElement('div');
        openQuestion.classList.add('inputGroup');
        openQuestion.appendChild(this.addNewQuestion('openQuestion', true));
        main.appendChild(openQuestion);
    },

    addNewClosedQuestion() {
        const main = $id('addForm-questionList');
        const closedQuestion = document.createElement('div');
        closedQuestion.classList.add('inputGroup');
        closedQuestion.appendChild(this.addNewQuestion('closedQuestion', false));

        ['1.', '2.', '3.'].forEach(inputPlaceholder => {
            closedQuestion.appendChild(this.addNewAnswer(inputPlaceholder));
        });

        main.appendChild(closedQuestion);
    },

    addNewQuestion(className, isOpen) {
        const question = document.createElement('input');
        question.classList.add('question');
        question.className = className;
        if (isOpen)
            question.placeholder = 'Enter your open question';
        else
            question.placeholder = 'Enter your closed question';
        return question;
    },

    addNewAnswer(placeholder) {
        const answer = document.createElement('input');
        answer.classList.add('question');
        answer.placeholder = placeholder;
        return answer;
    },

    saveFormToDataBase() {
        const questions = [];
        const doc = document.getElementById('addForm-questionList').children;
        for (let i = 0; i < doc.length; i++) {
            if (doc[i].children[0].className === 'openQuestion') {
                const question = {
                    number: i,
                    type: 'O',
                    language: 'EN',
                    content: doc[i].children[0].value,
                    numberOfAnswers: '|',
                    answers: []
                };
                questions.push(question);
            } else {
                const question = {
                    number: i,
                    type: 'W',
                    language: 'EN',
                    content: doc[i].children[0].value,
                    numberOfAnswers: doc[i].children.length - 1,
                    answers: [doc[i].children[1].value, doc[i].children[2].value,
                        doc[i].children[3].value]
                };
                questions.push(question);
            }
        }
        const formToBase = { title: document.getElementById('addForm-formName').value, questions };
        const dataToBase = JSON.stringify(formToBase);
        console.log(JSON.parse(dataToBase));
        // TODO sending to backend
    },

    assignEventListeners() {
        $id('addForm-addQuestions-openButton')
            .addEventListener('click', () => {
                this.addNewOpenQuestion();
            });

        $id('addForm-addQuestions-closedButton')
            .addEventListener('click', () => {
                this.addNewClosedQuestion();
            });

        $id('addForm-final-button')
            .addEventListener('click', () => {
                this.saveFormToDataBase();
            });
    }
};

exports.AddForm = AddForm;
