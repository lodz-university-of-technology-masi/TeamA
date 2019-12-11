
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
    userPool.getCurrentUser().globalSignOut();
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

exports.createCognitoUser = email => {
    return new AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: userPool
    });
}

exports.getUser = () => {
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
    });
}

exports.getUserAttributes = () => {
    const attributeList = [];
    const cognitoUser = this.getUser();

    if (cognitoUser != null) {
        cognitoUser.getSession( (err, session) => {

            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }

            cognitoUser.getUserAttributes( (err, result) => {
                if (err) {
                    alert(err.message || JSON.stringify(err));
                    return;
                }
                for (i = 0; i < result.length; i++) {
                    const att = {
                        Name: result[i].getName(),
                        Value: result[i].getValue()
                    };
        
                    attributeList.push(att);
                }
            });
        });
    }
    return attributeList;
};

exports.updateUserAttributes = attributeList => {
    const cognitoUser = this.getUser();

    if (cognitoUser != null) {
        cognitoUser.getSession( err => {

            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }

            cognitoUser.updateAttributes(attributeList, (err, result) => {
                if (err) {
                    alert(err.message || JSON.stringify(err));
                    return;
                }
            });
        });
    }
};

exports.addUserAttribute = (attributeName, attributeValue) => {
    const attributeList = this.getUserAttributes();
    const attributeData = {
        Name: attributeName,
        Value: attributeValue,
    };
    const attribute = new AmazonCognitoIdentity.CognitoUserAttribute(attributeData);
    attributeList.push(attribute);

    this.updateUserAttributes(attributeList);
}

exports.addCustomUserAttribute = (attributeName, attributeValue) => {
    this.addUserAttribute('custom:' + attributeName, attributeValue);
}

exports.checkUserAttribute = attributeName => {
    const attributeList = [];
    const cognitoUser = this.getUser();

    if (cognitoUser != null) {
        cognitoUser.getSession( (err, session) => {

            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }

            cognitoUser.getUserAttributes( (err, result) => {
                if (err) {
                    alert(err.message || JSON.stringify(err));
                    return;
                }
                for (i = 0; i < result.length; i++) {
                    if(result[i].getName() == attributeName) {
                        attributeList.push(result[i].getValue());
                    }
                }
            });
        });
    }
    return attributeList; //tutaj coś jest nie tak; nie mogę zwrócić wartości
}
