
const eyePng = require('../../icons/eye.png');

const { $id } = require('../utils');

const FillForm = {
    initialized: false,

    init() {
        this.initialized = true;

        // tutaj ładowanko z bazki
        const str = '[{"title":"Nazwa","questions":[{"number":1,"type":"O","language":"EN","content":"Pytanie otwarte #1","numberOfAnswers":"|","answers":[]},{"number":1,"type":"W","language":"EN","content":"Pytanie zamkniete","numberOfAnswers":3,"answers":["odpA","odpB","odpC"]},{"number":2,"type":"O","language":"EN","content":"Pytanie otwarte #2","numberOfAnswers":"|","answers":[]}]},{"title":"Nazwa","questions":[{"number":1,"type":"O","language":"EN","content":"Pytanie otwarte #1","numberOfAnswers":"|","answers":[]},{"number":1,"type":"W","language":"EN","content":"Pytanie zamkniete","numberOfAnswers":3,"answers":["odpA","odpB","odpC"]},{"number":2,"type":"O","language":"EN","content":"Pytanie otwarte #2","numberOfAnswers":"|","answers":[]}]},{"title":"Nazwa","questions":[{"number":1,"type":"O","language":"EN","content":"Pytanie otwarte #1","numberOfAnswers":"|","answers":[]},{"number":1,"type":"W","language":"EN","content":"Pytanie zamkniete","numberOfAnswers":3,"answers":["odpA","odpB","odpC"]},{"number":2,"type":"O","language":"EN","content":"Pytanie otwarte #2","numberOfAnswers":"|","answers":[]}]},{"title":"Nazwa","questions":[{"number":1,"type":"O","language":"EN","content":"Pytanie otwarte #1","numberOfAnswers":"|","answers":[]},{"number":1,"type":"W","language":"EN","content":"Pytanie zamkniete","numberOfAnswers":3,"answers":["odpA","odpB","odpC"]},{"number":2,"type":"O","language":"EN","content":"Pytanie otwarte #2","numberOfAnswers":"|","answers":[]}]},{"title":"Nazwa","questions":[{"number":1,"type":"O","language":"EN","content":"Pytanie otwarte #1","numberOfAnswers":"|","answers":[]},{"number":1,"type":"W","language":"EN","content":"Pytanie zamkniete","numberOfAnswers":3,"answers":["odpA","odpB","odpC"]},{"number":2,"type":"O","language":"EN","content":"Pytanie otwarte #2","numberOfAnswers":"|","answers":[]}]},{"title":"Nazwa","questions":[{"number":1,"type":"O","language":"EN","content":"Pytanie otwarte #1","numberOfAnswers":"|","answers":[]},{"number":1,"type":"W","language":"EN","content":"Pytanie zamkniete","numberOfAnswers":3,"answers":["odpA","odpB","odpC"]},{"number":2,"type":"O","language":"EN","content":"Pytanie otwarte #2","numberOfAnswers":"|","answers":[]}]},{"title":"Nazwa","questions":[{"number":1,"type":"O","language":"EN","content":"Pytanie otwarte #1","numberOfAnswers":"|","answers":[]},{"number":1,"type":"W","language":"EN","content":"Pytanie zamkniete","numberOfAnswers":3,"answers":["odpA","odpB","odpC"]},{"number":2,"type":"O","language":"EN","content":"Pytanie otwarte #2","numberOfAnswers":"|","answers":[]}]},{"title":"Nazwa","questions":[{"number":1,"type":"O","language":"EN","content":"Pytanie otwarte #1","numberOfAnswers":"|","answers":[]},{"number":1,"type":"W","language":"EN","content":"Pytanie zamkniete","numberOfAnswers":3,"answers":["odpA","odpB","odpC"]},{"number":2,"type":"O","language":"EN","content":"Pytanie otwarte #2","numberOfAnswers":"|","answers":[]}]},{"title":"Nazwa","questions":[{"number":1,"type":"O","language":"EN","content":"Pytanie otwarte #1","numberOfAnswers":"|","answers":[]},{"number":1,"type":"W","language":"EN","content":"Pytanie zamkniete","numberOfAnswers":3,"answers":["odpA","odpB","odpC"]},{"number":2,"type":"l","language":"EN","content":"Pytanie otwarte #2","numberOfAnswers":"|","answers":[]}]}]';
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
            img.src = eyePng;
            img.onclick = () => {
                this.show(form);
            };
            child.appendChild(img);

            div.appendChild(child);
            $id('fillForm-list-table').appendChild(div);
        }

        this.showAll();

        $id('fillForm-content-loading').remove();
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
        $id('fillForm-list').style.display = 'none';
        $id('fillForm-fill').style.display = 'block';

        $id('fillForm-form-title').innerHTML = which.title;
        $id('fillForm-form-content').innerHTML = '';

        for (const question of which.questions) {
            if (question.type.toLowerCase() === 'o') {
                $id('fillForm-form-content')
                    .appendChild(this.createOpenQuestion(question.number, question.content));
            } else if (question.type.toLowerCase() === 'w') {
                $id('fillForm-form-content')
                    .appendChild(
                        this.createClosedQuestion(question.number,
                            question.content,
                            question.answers)
                    );
            } else if (question.type.toLowerCase() === 'l') {
                $id('fillForm-form-content')
                    .appendChild(this.createNumberQuestion(question.number, question.content));
            }
        }

        $id('fillForm-form-buttons-finish').onclick = () => {
            this.finish(which);
        };
    },

    createOpenQuestion(number, question) {
        const div = document.createElement('div');
        div.classList.add('fillForm-form-question');
        div.classList.add('fillForm-form-openQuestion');

        const p = document.createElement('p');
        p.innerHTML = `${number}. ${question}`;
        div.appendChild(p);

        const input = document.createElement('input');
        input.placeholder = 'Your answer';
        div.appendChild(input);

        return div;
    },

    createClosedQuestion(number, question, answers) {
        const div = document.createElement('div');
        div.classList.add('fillForm-form-question');
        div.classList.add('fillForm-form-closedQuestion');

        const p = document.createElement('p');
        p.innerHTML = `${number}. ${question}`;
        div.appendChild(p);

        const commonName = `fillForm-form-question-${number}`;
        for (const [it, answer] of answers.entries()) {
            const label = document.createElement('label');
            label.for = `fillForm-form-question-${it}`;

            const input = document.createElement('input');
            input.id = `fillForm-form-question-${it}`;
            input.name = commonName;
            input.type = 'radio';
            label.appendChild(input);

            div.appendChild(label);

            const child = document.createElement('div');
            const dot = document.createElement('div');
            child.appendChild(dot);
            label.appendChild(child);

            const span = document.createElement('span');
            span.innerHTML = answer;
            label.appendChild(span);
        }

        return div;
    },

    createNumberQuestion(number, question) {
        const div = document.createElement('div');
        div.classList.add('fillForm-form-question');
        div.classList.add('fillForm-form-numericalQuestion');

        const p = document.createElement('p');
        p.innerHTML = `${number}. ${question}`;
        div.appendChild(p);

        const input = document.createElement('input');
        input.placeholder = 'Your answer';
        input.type = 'number';
        div.appendChild(input);

        return div;
    },

    finish(form) {
        // TODO: tutaj przetwarzanie formy
        console.log(form);
        this.showAll();
    },

    assignEventListeners() {}
};

exports.FillForm = FillForm;
