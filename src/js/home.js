import '../scss/home.scss';
import '../html/home.html';

const { $id } = require('./utils');
const { AddForm } = require('./HRModules/addForm');
const { AddUserToForm } = require('./HRModules/addUserToForm');
const { ShowForms } = require('./HRModules/showForms');
const { ShowFilledForms } = require('./HRModules/showFilledForms');
const { signOut, getToken } = require('./cognitoConfig');
const Cookies = require('./cookies');
const CsvManager = require('./csvManager');

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

window.onload = () => {
    getToken()
        .then(token => {
            if (!token) window.location.href = '/login.html';
        })
        .catch(() => {
            window.location.href = '/login.html';
        });

    const username = Cookies.get('user');

    $id('header-user-letter').innerHTML = username.substr(0, 1);
    $id('header-user-label').innerHTML = username;

    AddForm.assignEventListeners();
    AddUserToForm.assignEventListeners();
    ShowForms.assignEventListeners();

    $id('header-userActions-logout')
        .addEventListener('click', () => {
            signOut();
        });

    $id('panel-btn-1-2')
        .addEventListener('click', () => {
            ShowForms.open();
            SectionManager.choose('showForms');
        });

    $id('panel-btn-1-3')
        .addEventListener('click', () => {
            ShowFilledForms.open();
            SectionManager.choose('showFilledForms');
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
    $id('panel-btn-3-2').addEventListener('click', () => {
        ShowForms.open();
        SectionManager.choose('showForms');
    });

    $id('import-input').addEventListener('change', CsvManager.read);

    $id('showForms-import-file-button').addEventListener('click', () => {
        SectionManager.goBack();
        SectionManager.choose('import');
    });
    const backButtons = document.querySelectorAll('.sectionBack > div');
    for (const button of backButtons)
        button.addEventListener('click', () => SectionManager.goBack());
};
