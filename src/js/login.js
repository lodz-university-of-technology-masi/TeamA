import '../html/login.html';
import '../scss/login.scss';

import './cognitoConfig';
import './script';
import './vendor';

// import '../vendor/jquery-3.1.0';
// import '../vendor/aws-cognito-sdk.min';
// import '../vendor/amazon-cognito-identity.min';

global.fetch = require('node-fetch');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { $id } = require('./utils');
const Cookies = require('./cookies');

const poolData = {
    UserPoolId: window.cognitoConfig.cognito.userPoolId,
    ClientId: window.cognitoConfig.cognito.userPoolClientId
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function createCognitoUser(email) {
    return new AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: userPool
    });
}

const FormManager = {
    current: null,

    init() {
        this.assignHandlers();
    },

    chooseSection(section) {
        if (this.current === section)
            return;

        this.current = section;

        if (section === 'signin') {
            $id('form-tab-signin').setAttribute('name', 'chosen');
            $id('form-tab-signup').setAttribute('name', '');
            $id('form-tab-line').style.left = '0%';
            $id('form-signin').style.left = '0%';
            $id('form-signup').style.left = '100%';
        } else {
            $id('form-tab-signin').setAttribute('name', '');
            $id('form-tab-signup').setAttribute('name', 'chosen');
            $id('form-tab-line').style.left = '50%';
            $id('form-signin').style.left = '-100%';
            $id('form-signup').style.left = '0%';
        }
    },

    assignHandlers() {
        $id('form-tab-signin').addEventListener('click', () => {
            this.chooseSection('signin');
        });
        $id('form-tab-signup').addEventListener('click', () => {
            this.chooseSection('signup');
        });

        $id('button-signin').addEventListener('click', () => {
            SignIn.validate();
        });

        $id('button-signup').addEventListener('click', () => {
            SignUp.validate();
        });
    }
};

const SignIn = {
    queue: false,
    email: null,
    password: null,

    validate() {
        if (this.queue)
            return;

        SignIn.startQueue();

        this.email = $id('signin-email').value;
        this.password = $id('signin-password').value;

        this.signIn();
    },

    signIn() {
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: SignIn.email,
            Password: SignIn.password
        });

        const cognitoUser = createCognitoUser(SignIn.email);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: SignIn.success,
            onFailure: SignIn.failure
        });
    },

    success(result) {
        SignIn.stopQueue('Success');
        Cookies.set('user', createCognitoUser(SignIn.email).getUsername().split('@')[0], 365);
        Cookies.set('token', result.getAccessToken().getJwtToken(), 365);

        window.location.href = 'home.html';
    },

    failure() {
        SignIn.stopQueue('Wrong credentials');
    },

    startQueue() {
        $id('button-signin').innerHTML = 'Please wait...';
        $id('signin-email').disabled = true;
        $id('signin-password').disabled = true;
    },

    stopQueue(buttonText) {
        SignIn.queue = false;
        $id('button-signin').innerHTML = buttonText;
        $id('signin-email').disabled = false;
        $id('signin-password').disabled = false;
    }
};

const SignUp = {
    validate() {

    }
};

window.onload = () => {
    FormManager.init();
};
