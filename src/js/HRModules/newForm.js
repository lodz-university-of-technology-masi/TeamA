const removeImage = require('../../icons/delete.png');
const remove2Image = require('../../icons/close.png');

exports.createOpenQuestion = (number, removeCallback) => {
    const div = document.createElement('div');
    div.classList.add('newForm-question');
    div.classList.add('newForm-openQuestion');

    const row = document.createElement('div');

    const p = document.createElement('p');
    p.innerHTML = `${number}. `;
    row.appendChild(p);

    const pInput = document.createElement('input');
    pInput.placeholder = 'Treść pytania otwartego';
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

exports.createClosedQuestion = (number, removeCallback) => {
    const div = document.createElement('div');
    div.classList.add('newForm-question');
    div.classList.add('newForm-closedQuestion');

    const row = document.createElement('div');

    const p = document.createElement('p');
    p.innerHTML = `${number}. `;
    row.appendChild(p);

    const pInput = document.createElement('input');
    pInput.placeholder = 'Treść pytania zamkniętego';
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
    for (let i = 1; i <= 2; i++) {
        const answer = {};

        const dom = addClosedOption(i, commonName);

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

exports.createNumberQuestion = (number, removeCallback) => {
    const div = document.createElement('div');
    div.classList.add('newForm-question');
    div.classList.add('newForm-numericalQuestion');

    const row = document.createElement('div');

    const p = document.createElement('p');
    p.innerHTML = `${number}. `;
    row.appendChild(p);

    const pInput = document.createElement('input');
    pInput.placeholder = 'Treść pytania liczbowego';
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
