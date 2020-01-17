const $ = require('jquery');
const Cookies = require('./cookies');

const authMetod = Cookies.get('IdToken');
const langEn = '&lang=en-pl';
const langPl = '&lang=pl-en';
let finalPage;
const translatorPath = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20191223T141406Z.6e0f4caa448bec56.73adddf61bcd1c55ea89bc959b954956005c23d0';

exports.translateText = text => new Promise((resolve, reject) => {
    const language = document.getElementById('header-language-isPolish').checked;
    const textToTranslate = `&text=${text}`;
    if (language)
        finalPage = `${translatorPath}${textToTranslate}${langEn}`;
    else
        finalPage = `${translatorPath}${textToTranslate}${langPl}`;

    $.ajax({
        method: 'GET',
        url: finalPage,
        headers: {
            Authorization: authMetod
        },
        contentType: 'application/json',
        success: resp => resolve(resp.text),
        error: (jqXHR, textStatus, errorThrown) => {
            reject();
            console.error(
                'Error requesting ride: ',
                textStatus,
                ', Details: ',
                errorThrown
            );
        }
    });
});
