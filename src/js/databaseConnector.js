const $ = require('jquery');
const Cognito = require('./cognitoConfig');
const Dialogs = require('./common/dialogs');

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
        success: () => {
            Dialogs.alert(
                'Dodano do bazy danych',
                'Twój formularz został dodany do bazy danych, możesz go teraz zobaczyć w oknie: "Zobacz szablony formularzy".',
                () => {
                }
            );
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error(
                'Error requesting ride: ',
                textStatus,
                ', Details: ',
                errorThrown
            );
            Dialogs.alert(
                'Nie dodano do bazy danych',
                'Podczas dodawania wystąpił nieoczekiwany błąd.".',
                () => {
                }
            );
        }
    });
};

exports.getFormsFromDatabase = () => new Promise((resolve, reject) => {
    $.ajax({
        method: 'GET',
        url: 'https://2gs2moc88g.execute-api.us-east-1.amazonaws.com/Webpage/-test',
        headers: {
            Authorization: Cognito.getToken()
        },
        contentType: 'application/json',
        success: resp => resolve(resp.body),
        error: (jqXHR, textStatus, errorThrown) => {
            reject();
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            Dialogs.alert(
                'Nie pobrano z bazy danych',
                'Podczas pobierania listy formularzy wystąpił nieoczekiwany błąd.',
                () => {
                }
            );
        }
    });
});

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
            questions: JSON.stringify(filledForm.questions)
        }),
        contentType: 'application/json',
        success: () => {
            Dialogs.alert(
                'Dodano do bazy danych',
                'Twój wypełniony formularz został dodany do bazy danych.',
                () => {
                }
            );
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            Dialogs.alert(
                'Nie dodano do bazy danych',
                'Podczas dodawania formularza wystąpił nieoczekiwany błąd.',
                () => {
                }
            );
        }
    });
};

exports.getFilledFormFromDatabase = () => new Promise(resolve => {
    $.ajax({
        method: 'GET',
        url:
      'https://2gs2moc88g.execute-api.us-east-1.amazonaws.com/Webpage/filledform',
        headers: {
            Authorization: Cognito.getToken()
        },
        data: JSON
            .stringify(),
        contentType: 'application/json',
        success: resp => resolve(resp.body),
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            Dialogs.alert(
                'Nie pobrano listy z bazy danych',
                'Podczas pobierania formularzy wystąpił nieoczekiwany błąd.".',
                () => {
                }
            );
        }
    });
});

exports.sendResultToDatabase = result => {
    $.ajax({
        method: 'POST',
        url: 'https://2gs2moc88g.execute-api.us-east-1.amazonaws.com/Webpage/results',
        headers: {
            Authorization: Cognito.getToken()
        },
        data: JSON.stringify({
            formTitle: result.formTitle,
            owner: result.owner,
            hrEmployer: result.hrEmployer,
            points: result.points
        }),
        contentType: 'application/json',
        success: () => {
            Dialogs.alert(
                'Dodano do bazy danych',
                'Twój wynik został pomyślnie dodany do bazy danych.',
                () => {
                }
            );
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error(
                'Error requesting ride: ',
                textStatus,
                ', Details: ',
                errorThrown
            );
            Dialogs.alert(
                'Nie dodano do bazy danych',
                'Podczas dodawania do bazy danych wystąpił nieoczekiwany błąd.',
                () => {
                }
            );
        }
    });
};

exports.getResultFromDatabase = () => new Promise(resolve => {
    $.ajax({
        method: 'GET',
        url: 'https://2gs2moc88g.execute-api.us-east-1.amazonaws.com/Webpage/results',
        headers: {
            Authorization: Cognito.getToken()
        },
        data: JSON.stringify(
            // TODO
        ),
        contentType: 'application/json',
        success: resp => resolve(resp.body),
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            Dialogs.alert(
                'Nie pobrano z bazy danych',
                'Podczas pobierania danych z bazy danych wystąpił nieoczekiwany błąd.',
                () => {
                }
            );
        }
    });
});
