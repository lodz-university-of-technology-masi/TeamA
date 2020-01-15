const eyePng = require('../../icons/eye.png');
const pencilPng = require('../../icons/pencil.png');
const deletePng = require('../../icons/delete.png');
const downloadPng = require('../../icons/download.png');

const { $id } = require('../utils');
const {
    createOpenQuestion,
    createClosedQuestion,
    createNumberQuestion
} = require('../common/form');
const Dialogs = require('../common/dialogs');
const { getFormsFromDatabase, removeFormFromDatabase } = require('../databaseConnector');
const csvManager = require('../csvManager');
const { translateText } = require('../translator');

const ShowForms = {
    initialized: false,

    init() {
        this.initialized = true;

        Promise.resolve(getFormsFromDatabase()).then(str => {
            const forms = JSON.parse(str);

            for (const [it, form] of forms.entries()) {
                const div = document.createElement('div');

                let child = document.createElement('div');
                child.innerHTML = it + 1;
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
                img.src = downloadPng;
                img.onclick = () => {
                    csvManager.saveCsv(form);
                };
                child.appendChild(img);
                div.appendChild(child);

                child = document.createElement('div');
                img = new Image();
                img.src = deletePng;
                img.onclick = () => {
                    Dialogs.confirm(
                        'Usuwanie formularza',
                        'Czy na pewno chcesz usunąć ten formluarz? Tego nie da się cofnąć!',
                        () => {
                            removeFormFromDatabase(form.formId);
                        }
                    );
                };
                child.appendChild(img);

                div.appendChild(child);

                $id('showForms-list-table').appendChild(div);
            }

            this.showAll();

            $id('showForms-content-loading').remove();
        });
    },

    translated() {
        this.initialized = true;

        Promise.resolve(getFormsFromDatabase()).then(str => {
            const forms = JSON.parse(str);

            const dataToTranslate = [];
            for (let i = 0; i < forms.length; i++) {
                dataToTranslate.push(forms[i].title);
                for (let j = 0; j < forms[i].questions.length; j++) {
                    dataToTranslate.push(forms[i].questions[j].content);
                }
            }
            translateText(JSON.stringify(dataToTranslate)).then(result => {
                try {
                    const translatedText = JSON.parse(result);

                    let i = 0;
                    for (let z = 0; z < forms.length; z++) {
                        forms[z].title = translatedText[i];
                        for (let j = 0; j < forms[z].questions.length; j++) {
                            i += 1;
                            forms[z].questions[j].content = translatedText[i];
                        }
                        i += 1;
                    }
                } catch (e) {
                    Dialogs.alert('Error', 'Nastąpił problem podczas działania aplikacji translatora, aplikacja zwróciła nie poprawne dane, proszę przeładować aplikację.');
                    this.clear();
                    this.showAll();
                }


                for (const [it, form] of forms.entries()) {
                    const div = document.createElement('div');

                    let child = document.createElement('div');
                    child.innerHTML = it + 1;
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
                    img.src = downloadPng;
                    img.onclick = () => {
                        csvManager.saveCsv(form);
                    };
                    child.appendChild(img);
                    div.appendChild(child);

                    child = document.createElement('div');
                    img = new Image();
                    img.src = deletePng;
                    img.onclick = () => {
                        Dialogs.confirm(
                            'Usuwanie formularza',
                            'Czy na pewno chcesz usunąć ten formluarz? Tego nie da się cofnąć!',
                            () => {
                                removeFormFromDatabase(form.formId);
                            }
                        );
                    };
                    child.appendChild(img);

                    div.appendChild(child);

                    $id('showForms-list-table').appendChild(div);
                }

                this.showAll();
            });
        });
    },

    open() {
        if (!this.initialized) this.init();
        else this.showAll();
    },

    showAll() {
        $id('showForms-list').style.display = 'block';
        $id('showForms-form').style.display = 'none';
    },

    clear() {
        const node = document.getElementById('showForms-list-table');
        while (node.children.length > 1) {
            node.removeChild(node.children[1]);
        }
    },

    show(which) {
        $id('showForms-list').style.display = 'none';
        $id('showForms-form').style.display = 'block';

        $id('showForms-form-title').innerHTML = which.title;
        $id('showForms-form-content').innerHTML = '';

        for (const question of which.questions) {
            if (question.type.toLowerCase() === 'o') {
                $id('showForms-form-content').appendChild(
                    createOpenQuestion(question.number, question.content)
                );
            } else if (question.type.toLowerCase() === 'w') {
                $id('showForms-form-content').appendChild(
                    createClosedQuestion(
                        question.number,
                        question.content,
                        question.answers
                    )
                );
            } else if (question.type.toLowerCase() === 'l') {
                $id('showForms-form-content').appendChild(
                    createNumberQuestion(question.number, question.content)
                );
            }
        }
    },

    assignEventListeners() {
        $id('showForms-form-buttons-back').addEventListener('click', () => {
            this.showAll();
        });
    }
};

exports.ShowForms = ShowForms;
