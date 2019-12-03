import '../html/index.html';
import '../scss/index.scss';

const { getToken } = require('./cognitoConfig');

getToken().then(token => {
    if (!token)
        window.location.href = '/login.html';
    else {
        // TODO: Rozróżnić użytkowników
        window.location.href = '/home.html';
    }
}).catch(() => {
    window.location.href = '/login.html';
});
