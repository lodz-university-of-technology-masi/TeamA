
global.fetch = require('node-fetch');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const Cookies = require('./cookies');

window.cognitoConfig = {
    cognito: {
        userPoolId: 'us-east-1_lS2tMePyI', // e.g. us-east-2_uXboG5pAb
        userPoolClientId: '4k3to3pjtidq5qvnglpdvmtvfc', // e.g. 25ddkmj4v6hfsfvruhpfi7n4hv
        region: 'us-east-1' // e.g. us-east-2
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

/*
 * Nad poniższą sekcją jeszcze pracuje
 */
exports.getUser = () => {
    console.log(userPool.getCurrentUser());
    return userPool.getCurrentUser();
};

exports.deleteUser = () => {
    userPool.getCurrentUser().deleteUser();
};

exports.changePassword = (oldPassword, newPassword) => {
    this.getUser().changePassword(oldPassword, newPassword, (err, result) => {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        //TODO: wyświetlenie potwierdzenia jakiegoś
        console.log('call result: ' + result);
    });
}

exports.getUserAttributes = () => {
    this.getUser().getUserAttributes( (err, result) => {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        for (i = 0; i < result.length; i++) {
            console.log(
                'attribute ' + result[i].getName() + ' has value ' + result[i].getValue()
            );
        }
        return (result);
    });
}

/*
var attributeList = [];
var attribute = {
    Name: 'nickname',
    Value: 'joe',
};
var attribute = new AmazonCognitoIdentity.CognitoUserAttribute(attribute);
attributeList.push(attribute);
 */

exports.addUserAttribute = (attributeName, attributeValue) => {
    const attributeList = this.getUserAttributes();
    const attribute = {
        Name: attributeName,
        Value: attributeValue,
    };
    attribute = new AmazonCognitoIdentity.CognitoUserAttribute(attribute);
    attributeList.push(attribute);
    console.log(attributeList);
}

exports.updateUserAttributes = attributeList => {
    this.getUser().updateAttributes(attributeList, (err, result) => {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        console.log('call result: ' + result);
    });
}



