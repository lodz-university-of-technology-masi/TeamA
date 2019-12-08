const $ = require('jquery');
const Cognito = require('./cognitoConfig');

const invokeUrl = 'https://2gs2moc88g.execute-api.us-east-1.amazonaws.com/Webpage'

exports.sendFormToDatabase = dataToBase => {

    $.ajax({
        method: 'POST',
        url: invokeUrl + '/-test',
        headers: {
            Authorization: Cognito.getToken()
        },
        data: JSON.stringify({
            title: dataToBase.title,
            questions: JSON.stringify(dataToBase.questions)
        }),
        contentType: 'application/json',
        success: (resp) => {
            console.log(resp);
            // TODO ZROBIC WYSWIETLAJACE SIE OKIENKO
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            // TODO ZROBIC WYSWIETLAJACE SIE OKIENKO
        }
    });
};

exports.getFormsFromDatabase = () => {
    $.ajax({
        method: 'GET',
        url: invokeUrl + '/-test',
        headers: {
            Authorization: Cognito.getToken()
        },
        contentType: 'application/json',
        success: (resp) => {
            json = JSON.parse(resp.body);
            console.log(json);
            return json;
            // TODO wykorzystac
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            // TODO ZROBIC WYSWIETLAJACE SIE OKIENKO
        }
    });
};

exports.sendFilledFormToDatabase = filledForm => {
    $.ajax({
        method: 'POST',
        url: invokeUrl + '/filledform',
        headers: {
            Authorization: Cognito.getToken()
        },
        data: JSON.stringify({
            title: filledForm.title,
            owner: filledForm.owner,
            questions: JSON.stringify(filledForm.questions)
        }),
        contentType: 'application/json',
        success: () => {
            // TODO ZROBIC WYSWIETLAJACE SIE OKIENKO
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            // TODO ZROBIC WYSWIETLAJACE SIE OKIENKO
        }
    });
};

exports.getFilledFormFromDatabase = () => {
    $.ajax({
        method: 'GET',
        url: invokeUrl + '/filledform',
        headers: {
            Authorization: Cognito.getToken()
        },
        data: JSON.stringify(
            // TODO
        ),
        contentType: 'application/json',
        success: (resp) => {
            json = JSON.parse(resp.body);
            console.log(json);
            return json;
            // TODO ZROBIC WYSWIETLAJACE SIE OKIENKO
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            // TODO ZROBIC WYSWIETLAJACE SIE OKIENKO
        }
    });
};
