const $ = require('jquery');
const Cookies = require('./cookies');
const Dialogs = require('./common/dialogs');
const {
    Wait
} = require('./common/wait');

const invokeUrl = 'https://2gs2moc88g.execute-api.us-east-1.amazonaws.com/Webpage';
const authMetod = Cookies.get('IdToken');

exports.sendFormToDatabase = (dataToBase, callback) => {
    $.ajax({
        method: 'POST',
        url: `${invokeUrl}/-test`,
        headers: {
            Authorization: authMetod
        },
        data: JSON.stringify({
            title: dataToBase.title,
            questions: JSON.stringify(dataToBase.questions),
            assignedUsers: JSON.stringify(dataToBase.assignedUsers)
        }),
        contentType: 'application/json',
        success: () => {
            Wait.close();
            if (typeof callback !== 'undefined')
                callback();
            Dialogs.alert(
                'Dodano do bazy danych',
                'Twój formularz został dodany do bazy danych, możesz go teraz zobaczyć w oknie: "Zobacz szablony formularzy".'
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
                'Podczas dodawania wystąpił nieoczekiwany błąd.'
            );
        }
    });
};

exports.getFormsFromDatabase = () => new Promise((resolve, reject) => {
    $.ajax({
        method: 'GET',
        url: `${invokeUrl}/-test`,
        headers: {
            Authorization: authMetod
        },
        contentType: 'application/json',
        success: resp => resolve(resp.body),
        error: (jqXHR, textStatus, errorThrown) => {
            reject();
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            Dialogs.alert(
                'Nie pobrano z bazy danych',
                'Podczas pobierania listy formularzy wystąpił nieoczekiwany błąd.'
            );
        }
    });
});

exports.getUserFormsFromDatabase = () => new Promise((resolve, reject) => {
    $.ajax({
        method: 'GET',
        url: `${invokeUrl}/-test/my`,
        headers: {
            Authorization: authMetod
        },
        contentType: 'application/json',
        success: resp => resolve(resp.body),
        error: (jqXHR, textStatus, errorThrown) => {
            reject();
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            Dialogs.alert(
                'Nie pobrano z bazy danych',
                'Podczas pobierania listy formularzy wystąpił nieoczekiwany błąd.'
            );
        }
    });
});

exports.removeFormFromDatabase = (formId, callback) => {
    $.ajax({
        method: 'DELETE',
        url: `${invokeUrl}/-test`,
        headers: {
            Authorization: authMetod
        },
        data: JSON.stringify({
            id: formId
        }),
        contentType: 'application/json',
        success: () => {
            Wait.close();
            if (typeof callback !== 'undefined')
                callback();
            Dialogs.alert(
                'Usunięto formularz z bazy',
                'Twój formularz został pomyślnie usunięty z bazy danych.'
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
                'Nie usunięto formularza z bazy danych',
                'Podczas usuwania wystąpił nieoczekiwany błąd.'
            );
        }
    });
};

exports.removeFormFromDatabaseWithoutWarning = (formId, callback) => {
    $.ajax({
        method: 'DELETE',
        url: `${invokeUrl}/-test`,
        headers: {
            Authorization: authMetod
        },
        data: JSON.stringify({
            id: formId
        }),
        contentType: 'application/json',
        success: () => {
            if (typeof callback !== 'undefined')
                callback();
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error(
                'Error requesting ride: ',
                textStatus,
                ', Details: ',
                errorThrown
            );
            Dialogs.alert(
                'Nie usunięto formularza z bazy danych',
                'Podczas usuwania wystąpił nieoczekiwany błąd.'
            );
        }
    });
};

exports.sendFilledFormToDatabase = filledForm => {
    $.ajax({
        method: 'POST',
        url: `${invokeUrl}/filledform`,
        headers: {
            Authorization: authMetod
        },
        data: JSON.stringify({
            title: filledForm.title,
            owner: filledForm.owner,
            questions: JSON.stringify(filledForm.questions)
        }),
        contentType: 'application/json',
        success: () => {
            Wait.close();
            Dialogs.alert(
                'Dodano do bazy danych',
                'Twój wypełniony formularz został dodany do bazy danych.'
            );
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            Dialogs.alert(
                'Nie dodano do bazy danych',
                'Podczas dodawania formularza wystąpił nieoczekiwany błąd.'
            );
        }
    });
};

exports.getFilledFormFromDatabase = () => new Promise(resolve => {
    $.ajax({
        method: 'GET',
        url: `${invokeUrl}/filledform`,
        headers: {
            Authorization: authMetod
        },
        contentType: 'application/json',
        success: resp => resolve(resp.body),
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            Dialogs.alert(
                'Nie pobrano listy z bazy danych',
                'Podczas pobierania formularzy wystąpił nieoczekiwany błąd.'
            );
        }
    });
});

exports.getEvaluatedFilledFormFromDatabase = () => new Promise(resolve => {
    $.ajax({
        method: 'GET',
        url: `${invokeUrl}/filledform/my`,
        headers: {
            Authorization: authMetod
        },
        contentType: 'application/json',
        success: resp => resolve(resp.body),
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            Dialogs.alert(
                'Nie pobrano listy z bazy danych',
                'Podczas pobierania formularzy wystąpił nieoczekiwany błąd.'
            );
        }
    });
});

const removeFilledFormFromDatabase = (filledFormId, callback) => {
    $.ajax({
        method: 'DELETE',
        url: `${invokeUrl}/filledform`,
        headers: {
            Authorization: authMetod
        },
        data: JSON.stringify({
            id: filledFormId
        }),
        contentType: 'application/json',
        success: () => {
            Wait.close();
            callback();

            Dialogs.alert(
                'Dodano do bazy danych',
                'Twój wynik został pomyślnie dodany do bazy danych.'
            );
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
        }
    });
};

exports.removeFilledFormFromDatabase = removeFilledFormFromDatabase;


exports.sendResultToDatabase = (result, callback) => {
    $.ajax({
        method: 'POST',
        url: `${invokeUrl}/results`,
        headers: {
            Authorization: authMetod
        },
        data: JSON.stringify({
            formTitle: result.formTitle,
            owner: result.owner,
            hrEmployer: result.hrEmployer,
            optionalComments: JSON.stringify(result.optionalComments),
            points: result.points
        }),
        contentType: 'application/json',
        success: () => {
            removeFilledFormFromDatabase(result.formId, callback);
        },
        error: (jqXHR, textStatus, errorThrown) => {
            Wait.close();
            console.error(
                'Error requesting ride: ',
                textStatus,
                ', Details: ',
                errorThrown
            );
            Dialogs.alert(
                'Nie dodano do bazy danych',
                'Podczas dodawania do bazy danych wystąpił nieoczekiwany błąd.'
            );
        }
    });
};

exports.getResultFromDatabase = () => new Promise(resolve => {
    $.ajax({
        method: 'GET',
        url: `${invokeUrl}/results/my`,
        headers: {
            Authorization: authMetod
        },
        contentType: 'application/json',
        success: resp => resolve(resp.body),
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            Dialogs.alert(
                'Nie pobrano z bazy danych',
                'Podczas pobierania danych z bazy danych wystąpił nieoczekiwany błąd.'
            );
        }
    });
});

exports.removeResultFromDatabase = resultId => {
    $.ajax({
        method: 'DELETE',
        url: `${invokeUrl}/results`,
        headers: {
            Authorization: authMetod
        },
        data: JSON.stringify({
            id: resultId
        }),
        contentType: 'application/json',
        success: () => {},
        error: (jqXHR, textStatus, errorThrown) => {
            console.error(
                'Error requesting ride: ',
                textStatus,
                ', Details: ',
                errorThrown
            );
        }
    });
};

exports.getUsers = () => new Promise(resolve => {
    $.ajax({
        method: 'GET',
        url: 'https://iqxvh51xp7.execute-api.us-east-1.amazonaws.com/CognitoStage/user',
        headers: {
            Authorization: authMetod
        },
        contentType: 'application/json',
        success: resp => resolve(resp.body),
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            Dialogs.alert(
                'Nie pobrano listy użytkowników',
                'Podczas pobierania userów wystąpił nieoczekiwany błąd.'
            );
        }
    });
});

exports.getRole = () => new Promise(resolve => {
    $.ajax({
        method: 'GET',
        url: 'https://iqxvh51xp7.execute-api.us-east-1.amazonaws.com/CognitoStage/role',
        headers: {
            Authorization: authMetod
        },
        contentType: 'application/json',
        success: resp => resolve(resp.body),
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            Dialogs.alert(
                'Nie pobrano listy użytkowników',
                'Podczas pobierania userów wystąpił nieoczekiwany błąd.'
            );
        }
    });
});
