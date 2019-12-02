
exports.createOpenQuestion = (number, question) => {
    const div = document.createElement('div');
    div.classList.add('form-question');
    div.classList.add('form-openQuestion');

    const p = document.createElement('p');
    p.innerHTML = `${number}. ${question}`;
    div.appendChild(p);

    const input = document.createElement('input');
    input.placeholder = 'Twoja odpowiedź';
    div.appendChild(input);

    return div;
};

exports.createClosedQuestion = (number, question, answers) => {
    const div = document.createElement('div');
    div.classList.add('form-question');
    div.classList.add('form-closedQuestion');

    const p = document.createElement('p');
    p.innerHTML = `${number}. ${question}`;
    div.appendChild(p);

    const commonName = `showForms-form-question-${number}`;
    for (const [it, answer] of answers.entries()) {
        const label = document.createElement('label');
        label.for = `showForms-form-question-${it}`;

        const input = document.createElement('input');
        input.id = `showForms-form-question-${it}`;
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
};

exports.createNumberQuestion = (number, question) => {
    const div = document.createElement('div');
    div.classList.add('form-question');
    div.classList.add('form-numericalQuestion');

    const p = document.createElement('p');
    p.innerHTML = `${number}. ${question}`;
    div.appendChild(p);

    const input = document.createElement('input');
    input.placeholder = 'Twoja odpowiedź';
    input.type = 'number';
    div.appendChild(input);

    return div;
};
