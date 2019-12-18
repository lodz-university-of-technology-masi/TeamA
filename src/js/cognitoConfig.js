
global.fetch = require('node-fetch');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const Cookies = require('./cookies');

const cognitoConfig = {
    cognito: {
        userPoolId: 'us-east-1_lS2tMePyI',
        userPoolClientId: '4k3to3pjtidq5qvnglpdvmtvfc',
        region: 'us-east-1'
    }
};

const poolData = {
    UserPoolId: cognitoConfig.cognito.userPoolId,
    ClientId: cognitoConfig.cognito.userPoolClientId
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

exports.signOut = () => {
    userPool.getCurrentUser().signOut();
    Cookies.set('user', '', -1);
    window.location.href = '/login.html';
};

exports.getToken = () => new Promise((resolve, reject) => {
    const cognitoUser = this.getUser();

    if (cognitoUser) {
        cognitoUser.getSession((err, session) => {
            if (err) {
                reject(err);
            } else if (!session.isValid()) {
                resolve(null);
            } else {
                resolve(session.getIdToken().getJwtToken());
            }
        });
    } else {
        resolve(null);
    }
});

exports.createCognitoUser = email => new AmazonCognitoIdentity.CognitoUser({
    Username: email,
    Pool: userPool
});

exports.getUser = () => userPool.getCurrentUser();

exports.deleteUser = () => {
    userPool.getCurrentUser().deleteUser();
};

exports.changePassword = (oldPassword, newPassword) => {
    this.getUser().changePassword(oldPassword, newPassword, err => {
        if (err) {
            // TODO: wyświetlenie errora jakiegoś
            //  alert(err.message || JSON.stringify(err));
        } else {
            // TODO: wyświetlenie potwierdzenia jakiegoś
        }
    });
};
