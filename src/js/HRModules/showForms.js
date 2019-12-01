const eyePng = require('../../icons/eye.png');
const pencilPng = require('../../icons/pencil.png');
const deletePng = require('../../icons/delete.png');

const { $id } = require('../utils');
const { createOpenQuestion, createClosedQuestion, createNumberQuestion } = require('../common/form');

const ShowForms = {
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

            let img = new Image();
            img.src = eyePng;
            img.onclick = () => {
                this.show(form);
            };
            child.appendChild(img);

            div.appendChild(child);

            child = document.createElement('div');

            img = new Image();
            img.src = pencilPng;
            child.appendChild(img);

            div.appendChild(child);

            child = document.createElement('div');

            img = new Image();
            img.src = deletePng;
            child.appendChild(img);

            div.appendChild(child);

            $id('showForms-list-table').appendChild(div);
        }

        this.showAll();

        $id('showForms-content-loading').remove();
    },

    open() {
        if (!this.initialized)
            this.init();
        else
            this.showAll();
    },

    showAll() {
        $id('showForms-list').style.display = 'block';
        $id('showForms-form').style.display = 'none';
    },

    show(which) {
        $id('showForms-list').style.display = 'none';
        $id('showForms-form').style.display = 'block';

        $id('showForms-form-title').innerHTML = which.title;
        $id('showForms-form-content').innerHTML = '';

        for (const question of which.questions) {
            if (question.type.toLowerCase() === 'o') {
                $id('showForms-form-content')
                    .appendChild(createOpenQuestion(question.number, question.content));
            } else if (question.type.toLowerCase() === 'w') {
                $id('showForms-form-content')
                    .appendChild(
                        createClosedQuestion(question.number,
                            question.content,
                            question.answers)
                    );
            } else if (question.type.toLowerCase() === 'l') {
                $id('showForms-form-content')
                    .appendChild(createNumberQuestion(question.number, question.content));
            }
        }
    },

    assignEventListeners() {
        $id('showForms-form-buttons-back')
            .addEventListener('click', () => {
                this.showAll();
            });
    }
};

exports.ShowForms = ShowForms;
