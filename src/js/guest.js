import '../scss/guest.scss';
import '../html/guest.html';
import '../favicon.ico';

const { FillForm } = require('./guestModules/fillForm');
const { CheckedForm } = require('./guestModules/checkedForm');
const { $id } = require('./utils');
const { signOut, getToken } = require('./cognitoConfig');
const Cookies = require('./cookies');

const SectionManager = {
    currentElement: null,

    choose(name) {
        const newElement = $id(name);
        if (newElement && newElement !== this.currentElement) {
            this.currentElement = newElement;
            $id('panel').style.display = 'none';

            newElement.style.display = 'flex';
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
    getToken().then(token => {
        if (!token)
            window.location.href = '/login.html';
    }).catch(() => {
        window.location.href = '/login.html';
    });

    const username = Cookies.get('user');
    $id('header-user-letter').innerHTML = username.substr(0, 1);
    $id('header-user-label').innerHTML = username;

    FillForm.assignEventListeners();

    $id('header-userActions-logout')
        .addEventListener('click', () => {
            signOut();
        });

    $id('pane-tile-1')
        .addEventListener('click', () => {
            SectionManager.choose('fillForm');
            FillForm.open();
        });

    $id('pane-tile-2')
        .addEventListener('click', () => {
            SectionManager.choose('checkedForm');
            CheckedForm.open();
        });

    $id('pane-tile-3')
        .addEventListener('click', () => {
            signOut();
        });

    const backButtons = document.querySelectorAll('.sectionBack > div');
    for (const button of backButtons)
        button.addEventListener('click', () => {
            if (!FillForm.active)
                SectionManager.goBack();
        });
};
