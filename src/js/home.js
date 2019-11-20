import '../scss/home.scss';

function $id(id) {
    return document.getElementById(id);
}

function $(selector) {
    return document.querySelectorAll(selector);
}

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

window.onload = () => {
    $id('panel-btn-1-1')
        .addEventListener('click', () => {
            SectionManager.choose('addForm');
        });

    $id('panel-btn-2-1')
        .addEventListener('click', () => {
            AddUserToForm.init();
            SectionManager.choose('addUserToForm');
        });

    $id('panel-btn-3-1')
        .addEventListener('click', () => {
            SectionManager.choose('import');
        });
};

const AddUserToForm = {
    initialized: false,
    chosen: null,

    init() {
        if (this.initialized)
            return;

        this.initialized = true;

        this.chooseSection(0);
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
            });

            if (typeof form !== 'undefined') {
                form = form.dataset.form;
                $id('addUserToForm-summary-text').innerHTML =
                    `Czy na pewno chcesz dodać ${users.length} użytkownik ${users.length === 1 ? 'a' : 'ów'} do formluarza ${form}?`;
                $id('addUserToForm-acceptBtn').setAttribute('name', '');
            } else {
                $id('addUserToForm-summary-text').innerHTML = 'Nie wybrano żadnego formularza!';
                $id('addUserToForm-acceptBtn').setAttribute('name', 'inactive');
            }
        } else {
            $id('addUserToForm-summary-text').innerHTML = 'Nie wybrano żadnego użytkownika!';
            $id('addUserToForm-acceptBtn').setAttribute('name', 'inactive');
        }
    }
};

let newQuestion = (id, isOpen) => {
    const question = document.createElement("input");
    question.setAttribute("class","question");
    question.setAttribute("id", id);
    question.setAttribute("type","text");
    if (isOpen)
        question.setAttribute("placeholder", "Enter your open question");
    else
        question.setAttribute("placeholder", "Enter your closed question");
    return question;
};

let newAnswer = (placeholder) => {
    const answer = document.createElement("input");
    answer.setAttribute("class","question");
    answer.setAttribute("type","text");
    answer.setAttribute("placeholder", placeholder);
    return answer;
};

let addNewOpenQuestion = () => {
    const main = document.getElementById("addForm-questionList");
    const openQuestion = document.createElement("div");
    openQuestion.setAttribute("class","input");
    openQuestion.appendChild(newQuestion("open question", true));
    main.appendChild(openQuestion);
};

let addNewClosedQuestion = () => {
    const main = document.getElementById("addForm-questionList");
    const closedQuestion = document.createElement("div");
    closedQuestion.setAttribute("class","input");
    closedQuestion.appendChild(newQuestion("closed question", false));

    ["1. ", "2. ", "3. "].forEach((v) => {
        closedQuestion.appendChild(newAnswer(v));
    });

    main.appendChild(closedQuestion);
};

let saveFormToDataBase = () => {
    const doc = document.getElementsByClassName("question");
    let questionList = {"name": document.getElementById("name").value};

    for (let i = 0, number = 1; i < doc.length; i++, number++) {
        if (doc[i].id === "open question") {
            questionList["question" + number] = doc[i].value;
        }

        else {
            let question = {"question": doc[i].value};

            for (let j = i + 1; j < i + 4; j++) {
                question["answer" + (j - 1)] = doc[j].value;
            }

            i += 3;
            questionList["question" + number] = question;
        }
    }

    questionList = JSON.stringify(questionList);
    /* todo */
};