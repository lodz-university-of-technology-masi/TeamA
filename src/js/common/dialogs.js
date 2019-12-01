const { $id } = require('../utils');

function buildDialogContent(title, text) {
    const dialogSection = document.createElement('div');
    dialogSection.classList.add('dialog-content');

    const h5 = document.createElement('h5');
    h5.innerHTML = title;
    dialogSection.appendChild(h5);

    const p = document.createElement('p');
    p.innerHTML = text;
    dialogSection.appendChild(p);

    return dialogSection;
}

exports.confirm = (title, text, callback) => {
    const parent = document.createElement('div');

    const dialog = document.createElement('div');
    dialog.classList.add('dialog');

    dialog.appendChild(buildDialogContent(title, text));

    const dialogSection = document.createElement('div');
    dialogSection.classList.add('dialog-buttons');

    let button = document.createElement('button');
    button.classList.add('dialog-cancel');
    button.innerHTML = 'Anuluj';
    button.onclick = () => {
        parent.remove();
    };
    dialogSection.appendChild(button);

    button = document.createElement('button');
    button.classList.add('dialog-apply');
    button.innerHTML = 'Zatwierdź';
    button.onclick = () => {
        parent.remove();
        callback();
    };
    dialogSection.appendChild(button);

    dialog.appendChild(dialogSection);

    parent.appendChild(dialog);

    $id('dialogs').appendChild(parent);
};

exports.alert = (title, text) => {
    const parent = document.createElement('div');

    const dialog = document.createElement('div');
    dialog.classList.add('dialog');

    dialog.appendChild(buildDialogContent(title, text));

    const dialogSection = document.createElement('div');
    dialogSection.classList.add('dialog-buttons');

    const button = document.createElement('button');
    button.classList.add('dialog-cancel');
    button.innerHTML = 'Ok';
    button.onclick = () => {
        parent.remove();
    };

    dialogSection.appendChild(button);

    dialog.appendChild(dialogSection);

    parent.appendChild(dialog);

    $id('dialogs').appendChild(parent);
};
