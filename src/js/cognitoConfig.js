
global.fetch = require('node-fetch');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

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
    console.log("Logging out...");
    userPool.getCurrentUser().signOut();
    window.location.href = '/login.html';
    console.log("Logged out");
};

exports.getToken = () => new Promise(function fetchCurrentAuthToken(resolve, reject) {
    const cognitoUser = userPool.getCurrentUser();

    if (cognitoUser) {
        cognitoUser.getSession(function sessionCallback(err, session) {
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
