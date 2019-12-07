const eyePng = require('../../icons/eye.png');

const { $id } = require('../utils');
const { createOpenQuestion, createClosedQuestion, createNumberQuestion } = require('../common/form');

const CheckedForm = {
    initialized: false,

    init() {
        this.initialized = true;
        this.assignEventListeners();

        // TODO: Bazka
        const str = '[{"formTitle":"Nowy","owner":"metin90.1998","hrEmployer":"metin90.1998","points":[true,false, false]},{"formTitle":"Nowy","owner":"metin90.1998","hrEmployer":"metin90.1998","points":[true,true]},{"formTitle":"Nowy","owner":"metin90.1998","hrEmployer":"metin90.1998","points":[true,true]},{"formTitle":"Nowy","owner":"metin90.1998","hrEmployer":"metin90.1998","points":[true,true]},{"formTitle":"Nowy","owner":"metin90.1998","hrEmployer":"metin90.1998","points":[true,true]},{"formTitle":"Nowy","owner":"metin90.1998","hrEmployer":"metin90.1998","points":[false,true]}]';
        const forms = JSON.parse(str);

        for (const [it, form] of forms.entries()) {
            const div = document.createElement('div');

            let child = document.createElement('div');
            child.innerHTML = (it + 1);
            div.appendChild(child);

            child = document.createElement('div');
            child.innerHTML = form.formTitle;
            div.appendChild(child);

            child = document.createElement('div');
            child.innerHTML = form.hrEmployer;
            div.appendChild(child);

            let right = 0;
            const all = form.points.length;

            for (const point of form.points) {
                if (point) right++;
            }

            child = document.createElement('div');
            child.innerHTML = `${((right / all) * 100).toFixed(0)}%`;
            div.appendChild(child);

            child = document.createElement('div');

            const img = new Image();
            img.src = eyePng;
            img.onclick = () => {
                this.show(form);
            };
            child.appendChild(img);

            div.appendChild(child);
            $id('checkedForm-list-table').appendChild(div);
        }

        this.showAll();

        $id('checkedForm-content-loading').remove();
    },

    open() {
        if (!this.initialized)
            this.init();
        this.showAll();
    },

    showAll() {
        $id('checkedForm-list').style.display = 'block';
        $id('checkedForm-results').style.display = 'none';
    },

    show(which) {
        $id('checkedForm-list').style.display = 'none';
        $id('checkedForm-results').style.display = 'block';

        $id('checkedForm-results-loading').style.display = 'block';
        $id('checkedForm-results-container').style.display = 'none';

        // TODO: bazka
        console.log(which);
        const str = '{"title":"Nowy Form","questions":[{"number":1,"type":"O","language":"EN","content":"1. Open Question","numberOfAnswers":"|","answers":[],"userAnswer":"Form"},{"number":2,"type":"W","language":"EN","content":"2. Closed","numberOfAnswers":3,"answers":["1","2","3"],"userAnswer":"2"}, {"number":3,"type":"l","language":"EN","content":"1. Numerical Question","numberOfAnswers":"|","answers":[],"userAnswer":"13"}],"owner":"metin90.1998"}';
        const form = JSON.parse(str);

        $id('checkedForm-form-title').innerHTML = form.title;
        $id('checkedForm-form-content').innerHTML = '';

        for (const [it, question] of form.questions.entries()) {
            if (question.type.toLowerCase() === 'o') {
                const questionDOM = createOpenQuestion(question.number, question.content);

                if (which.points[it])
                    questionDOM.querySelector('p').style.color = '#2fa34e';
                else
                    questionDOM.querySelector('p').style.color = '#da2747';

                const input = questionDOM.querySelectorAll('input')[0];
                input.disabled = true;
                input.value = question.userAnswer;

                $id('checkedForm-form-content')
                    .appendChild(questionDOM);
            } else if (question.type.toLowerCase() === 'w') {
                const questionDOM = createClosedQuestion(question.number,
                    question.content,
                    question.answers);

                if (which.points[it])
                    questionDOM.querySelector('p').style.color = '#2fa34e';
                else
                    questionDOM.querySelector('p').style.color = '#da2747';

                const inputs = questionDOM.querySelectorAll('input');
                const labels = questionDOM.querySelectorAll('span');

                const limit = inputs.length;
                for (let i = 0; i < limit; i++) {
                    inputs[i].disabled = true;
                    if (labels[i].innerHTML === question.userAnswer)
                        inputs[i].checked = true;
                }

                $id('checkedForm-form-content')
                    .appendChild(questionDOM);
            } else if (question.type.toLowerCase() === 'l') {
                const questionDOM = createNumberQuestion(question.number, question.content);

                if (which.points[it])
                    questionDOM.querySelector('p').style.color = '#2fa34e';
                else
                    questionDOM.querySelector('p').style.color = '#da2747';

                const input = questionDOM.querySelectorAll('input')[0];
                input.disabled = true;
                input.value = question.userAnswer;

                $id('checkedForm-form-content')
                    .appendChild(questionDOM);
            }
        }

        $id('checkedForm-results-loading').style.display = 'none';
        $id('checkedForm-results-container').style.display = 'block';
    },

    assignEventListeners() {
        $id('checkedForm-form-buttons-back').onclick = () => {
            this.showAll();
        };
    }
};

exports.CheckedForm = CheckedForm;
