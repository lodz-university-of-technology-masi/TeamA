const $ = require('jquery');
const dynamo = require('aws-sdk');
const Cognito = require('./cognitoConfig');


exports.sendFormToDatabase = dataToBase => {
    $.ajax({
        method: 'POST',
        url: 'https://2gs2moc88g.execute-api.us-east-1.amazonaws.com/Webpage/-test',
        headers: {
            Authorization: Cognito.getToken()
        },
        data: JSON.stringify({
            title: dataToBase.title,
            questions: JSON.stringify(dataToBase.questions)
        }),
        contentType: 'application/json',
        success: resp => {
            console.log(resp.body);
            // TODO ZROBIC WYSWIETLAJACE SIE OKIENKO
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            // TODO ZROBIC WYSWIETLAJACE SIE OKIENKO
        }
    });
};

exports.getFormsFromDatabase = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'GET',
            url: 'https://2gs2moc88g.execute-api.us-east-1.amazonaws.com/Webpage/-test',
            headers: {
                Authorization: Cognito.getToken()
            },
            contentType: 'application/json',
            success: resp => { resolve(resp.body); },
            error: (jqXHR, textStatus, errorThrown) => {
                reject()
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                // TODO ZROBIC WYSWIETLAJACE SIE OKIENKO
            }
        });
    });
}

exports.sendFilledFormToDatabase = filledForm => {
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
        url: 'https://2gs2moc88g.execute-api.us-east-1.amazonaws.com/Webpage/filledform',
        headers: {
            Authorization: Cognito.getToken()
        },
        data: JSON.stringify(
            // TODO
        ),
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
