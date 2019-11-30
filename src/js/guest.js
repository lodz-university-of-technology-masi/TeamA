import '../scss/guest.scss';
import '../html/guest.html';

const { FillForm } = require('./guestModules/fillForm');
const { $id } = require('./utils');

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
    const username = 'Wiginiusz Pomyloński';

    $id('header-user-letter').innerHTML = username.substr(0, 1);
    $id('header-user-label').innerHTML = username;

    FillForm.assignEventListeners();

    $id('pane-tile-1')
        .addEventListener('click', () => {
            SectionManager.choose('fillForm');
            FillForm.open();
        });

    const backButtons = document.querySelectorAll('.sectionBack > div');
    for (const button of backButtons)
        button.addEventListener('click', () => SectionManager.goBack());
};
