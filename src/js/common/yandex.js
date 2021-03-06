const $ = require('jquery');
const Cookies = require('../cookies');
const Dialogs = require('./dialogs');
const apiKey = 'dict.1.1.20200109T132451Z.883112d4e6fb4405.4624ab7e4fe7b07143d653cb9665941823fb50d9';
const authMetod = Cookies.get('IdToken');

exports.getOneSynonym = text => new Promise((resolve, reject) => {
    $.ajax({
        method: 'GET',
        url: `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${apiKey}&lang=pl-ru&text=${text}`,
        headers: {
            Authorization: authMetod
        },
        contentType: 'application/json',
        success: resp => resolve(resp.def),
        error: (jqXHR, textStatus, errorThrown) => {
            reject();
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            Dialogs.alert(
                'Nie pobrano z bazy synonimów',
                'Podczas pobierania listy synonimów wystąpił nieoczekiwany błąd.'
            );
        }
    });
});

exports.getSynonyms = text => new Promise((resolve, reject) => {
    $.ajax({
        method: 'GET',
        url: `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${apiKey}&lang=ru-pl&text=${text}`,
        headers: {
            Authorization: authMetod
        },
        contentType: 'application/json',
        success: resp => resolve(resp.def),
        error: (jqXHR, textStatus, errorThrown) => {
            reject();
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            Dialogs.alert(
                'Nie pobrano z bazy synonimów',
                'Podczas pobierania listy synonimów wystąpił nieoczekiwany błąd.'
            );
        }
    });
});