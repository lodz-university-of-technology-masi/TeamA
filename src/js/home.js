import '../scss/home.scss';
import '../html/home.html';



function $id(id) {
    return document.getElementById(id);
}

function $(selector) {
    return document.querySelectorAll(selector);
}

const csvManager = require('./csvManager');

const SectionManager = {
    currentElement: null,

    choose(name) {
        const newElement = $id(name);
        if (newElement && newElement !== this.currentElement) {
            this.currentElement = newElement;
            $id('panel').style.display = 'none';

            newElement.style.display = 'block';
            setTimeout(() => {
                newElement.style.visibility = 'visible';
                newElement.style.opacity = '1';
            }, 100);
        }
    },

    goBack() {
        this.currentElement.style.display = 'none';
        this.currentElement.style.visibility = 'hidden';
        this.currentElement.style.opacity = '0';
        this.currentElement = null;

        $id('panel').style.display = 'block';
    }
};




(() => {
    const backButtons = document.querySelectorAll('.sectionBack > div');
    for (const button of backButtons)
        button.addEventListener('click', () => SectionManager.goBack());
})();

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
                    AddUserToForm.chooseSection(i);
                });
        }

        $id('addUserToForm-users-button')
            .addEventListener('click', () => {
                AddUserToForm.chooseSection(1);
            });

        $id('addUserToForm-form-button')
            .addEventListener('click', () => {
                AddUserToForm.chooseSection(2);
            });
    }
};

const AddForm = {
    open() {
        $id('addForm-formName').value = '';
        $id('addForm-questionList').innerHTML = '';
    },

    addNewOpenQuestion() {
        const main = $id('addForm-questionList');
        const openQuestion = document.createElement('div');
        openQuestion.classList.add('input');
        openQuestion.appendChild(this.addNewQuestion('open question', true));
        main.appendChild(openQuestion);
    },

    addNewClosedQuestion() {
        const main = $id('addForm-questionList');
        const closedQuestion = document.createElement('div');
        closedQuestion.classList.add('input');
        closedQuestion.appendChild(this.addNewQuestion('closed question', false));

        ['1.', '2.', '3.'].forEach(no => {
            closedQuestion.appendChild(this.addNewAnswer(no));
        });

        main.appendChild(closedQuestion);
    },

    addNewQuestion(id, isOpen) {
        const question = document.createElement('input');
        question.classList.add('question');
        question.id = id;
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
        const doc = document.getElementsByClassName('question');
        let questionList = { name: $id('name').value };

        let number = 1;
        for (let i = 0; i < doc.length; i++) {
            if (doc[i].id === 'open question') {
                questionList[`question${number}`] = doc[i].value;
            } else {
                const question = { question: doc[i].value };

                for (let j = i + 1; j < i + 4; j++)
                    question[`answer${j - 1}`] = doc[j].value;

                i += 3;
                questionList[`question${number}`] = question;
            }

            number++;
        }

        questionList = JSON.stringify(questionList);
        /* todo */
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

window.onload = () => {
    const username = 'Wiginiusz Pomyloński';

    $id('header-user-letter').innerHTML = username.substr(0, 1);
    $id('header-user-label').innerHTML = username;

    AddForm.assignEventListeners();
    AddUserToForm.assignEventListeners();

    $id('panel-btn-1-1')
        .addEventListener('click', () => {
            AddForm.open();
            SectionManager.choose('addForm');
        });

    $id('panel-btn-2-1')
        .addEventListener('click', () => {
            SectionManager.choose('addUserToForm');
            AddUserToForm.open();
        });

    $id('panel-btn-3-1')
        .addEventListener('click', () => {
            SectionManager.choose('import');
        });

    $id('import-input').addEventListener('change', csvManager.read);
};
