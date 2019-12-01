
global.fetch = require('node-fetch');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const Cookies = require('./cookies');

window.cognitoConfig = {
    cognito: {
        userPoolId: 'us-east-1_lS2tMePyI', // e.g. us-east-2_uXboG5pAb
        userPoolClientId: '4k3to3pjtidq5qvnglpdvmtvfc', // e.g. 25ddkmj4v6hfsfvruhpfi7n4hv
        region: 'us-east-1' // e.g. us-east-2
    },
    api: {
        invokeUrl: 'https://2gs2moc88g.execute-api.us-east-1.amazonaws.com/Webpage' // e.g. https://rc7nyt4tql.execute-api.us-west-2.amazonaws.com/prod,
    }
};

const poolData = {
    UserPoolId: window.cognitoConfig.cognito.userPoolId,
    ClientId: window.cognitoConfig.cognito.userPoolClientId
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
exports.userPool = userPool;

exports.signOut = () => {
    userPool.getCurrentUser().signOut();
    Cookies.set('user', '', -1);
    window.location.href = '/login.html';
};

exports.getToken = () => new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();

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
