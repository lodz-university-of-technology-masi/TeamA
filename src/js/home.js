import '../scss/home.scss';
import '../html/home.html';

import './cognitoConfig';

const { $id } = require('./utils');
const { AddForm } = require('./HRModules/addForm');
const { AddUserToForm } = require('./HRModules/addUserToForm');
const { ShowForms } = require('./HRModules/showForms');

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
    const authToken;
    window.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = '/index.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/index.html';
    });

    const username = 'Wiginiusz Pomyloński';

    $id('header-user-letter').innerHTML = username.substr(0, 1);
    $id('header-user-label').innerHTML = username;

    AddForm.assignEventListeners();
    AddUserToForm.assignEventListeners();
    ShowForms.assignEventListeners();

    $id('panel-btn-1-2')
        .addEventListener('click', () => {
            ShowForms.open();
            SectionManager.choose('showForms');
        });

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
};
