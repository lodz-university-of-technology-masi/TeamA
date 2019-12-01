const $ = require('jquery');
const Cognito = require('./cognitoConfig');


export function sendFormToDataBase(dataToBase) {
    $.ajax({
        method: 'POST',
        url: 'https://2gs2moc88g.execute-api.us-east-1.amazonaws.com/Webpage/-test',
        headers: {
            Authorization: Cognito.getToken()
        },
        data: JSON.stringify({
            title: dataToBase.title,
            questions: JSON.stringify(dataToBase)
        }),
        contentType: 'application/json',
        success: function dziala() {
            // TODO ZROBIC WYSWIETLAJACE SIE OKIENKO
        },
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            // TODO ZROBIC WYSWIETLAJACE SIE OKIENKO
        }
    });
}

export function getFormsFromDataBase() {
    $.ajax({
        method: 'GET',
        url: 'https://2gs2moc88g.execute-api.us-east-1.amazonaws.com/Webpage/-test',
        headers: {
            Authorization: Cognito.getToken()
        },
        contentType: 'application/json',
        success: function dziala() {
            // TODO wykorzystac
        },
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            // TODO ZROBIC WYSWIETLAJACE SIE OKIENKO
        }
    });
}

export function sendFilledFormToDataBase(filledForm) {
    $.ajax({
        method: 'POST',
        url: 'https://2gs2moc88g.execute-api.us-east-1.amazonaws.com/Webpage/filledform',
        headers: {
            Authorization: Cognito.getToken()
        },
        data: JSON.stringify({
            title: filledForm.title,
            owner: filledForm.owner,
            questions: JSON.stringify(filledForm)
        }),
        contentType: 'application/json',
        success: function dziala() {
            // TODO ZROBIC WYSWIETLAJACE SIE OKIENKO
        },
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            // TODO ZROBIC WYSWIETLAJACE SIE OKIENKO
        }
    });
}

export function getFilledFormFromDatabBase() {
    $.ajax({
        method: 'GET',
        url: 'https://2gs2moc88g.execute-api.us-east-1.amazonaws.com/Webpage/filledform',
        headers: {
            Authorization: Cognito.getToken()
        },
        data: JSON.stringify(
            // TODO
        ),
        contentType: 'application/json',
        success: function dziala() {
            // TODO ZROBIC WYSWIETLAJACE SIE OKIENKO
        },
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            // TODO ZROBIC WYSWIETLAJACE SIE OKIENKO
        }
    });
}
