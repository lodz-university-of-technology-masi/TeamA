import '../html/login.html';
import '../scss/login.scss';

global.fetch = require('node-fetch');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { $id } = require('./utils');
const Cookies = require('./cookies');
const Cognito = require('./cognitoConfig');

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

        $id('button-verify').addEventListener('click', () => {
            Verify.validate();
        });

        $id('button-signup-verify').addEventListener('click', () => {
            Verify.show();
        });

        $id('button-signup-back').addEventListener('click', () => {
            Verify.back();
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

        const cognitoUser = Cognito.createCognitoUser(SignIn.email);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: SignIn.success,
            onFailure: SignIn.failure
        });
    },

    success(result) {
        SignIn.stopQueue('Success');
        Cookies.set('user', SignIn.email.split('@')[0], 365);
        Cookies.set('IdToken', result.getIdToken().getJwtToken(), 365);

        window.location.href = 'home.html';
    },

    failure(err) {
        SignIn.stopQueue('Wrong credentials');
        console.log(err);
        $id('button-signin').style.background = '#ff0000';
    },

    startQueue() {
        SignIn.queue = true;
        $id('button-signin').innerHTML = 'Please wait...';
        $id('button-signin').style.background = '#39557C';
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
    email: null,

    validate() {
        this.email = $id('signup-email').value;
        const password = $id('signup-password').value;
        const password2 = $id('signup-password2').value;

        if (password === password2) {
            this.startQueue();
            this.signUp(password);
        } else {
            $id('button-signup').innerHTML = 'Passwords do not match';
            $id('button-signup').style.background = '#ff0000';
        }
    },

    signUp(password) {
        const dataEmail = {
            Name: 'email',
            Value: this.email
        };
        const dataRole = {
            Name: 'profile',
            Value: 'guest'
        };
        const dataNickname = {
            Name: 'nickname',
            Value: this.email.split('@')[0]
        };
        const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
        const attributeRole = new AmazonCognitoIdentity.CognitoUserAttribute(dataRole);
        const attributeNickname = new AmazonCognitoIdentity.CognitoUserAttribute(dataNickname);
        const attributeList = [];
        attributeList.push(attributeEmail);
        attributeList.push(attributeRole);
        attributeList.push(attributeNickname);

        Cognito.signUp(
            this.email,
            password,
            attributeList,
            null,
            (err, result) => {
                if (!err)
                    SignUp.success(result);
                else
                    SignUp.failure(err);
            }
        );
    },

    success() {
        this.stopQueue('Success');
        $id('verify-email').value = this.email;
        Verify.show();

        $id('signup-email').value = '';
        $id('signup-password').value = '';
        $id('signup-password2').value = '';
    },

    failure(err) {
        if (err.message.indexOf('length greater than or equal to 6') > -1)
            this.stopQueue('Too short password! (6 characters min)');
        else if (err.message.indexOf('Invalid email address format') > -1)
            this.stopQueue('Invalid email address format!');
        else if (err.code === 'UsernameExistsException')
            this.stopQueue('An account with the given email already exists.');
        else
            this.stopQueue('Something went wrong');

        $id('button-signup').style.background = '#ff0000';
    },

    startQueue() {
        SignUp.queue = true;
        $id('button-signup').innerHTML = 'Please wait...';
        $id('button-signup').style.background = '#39557C';
        $id('signup-email').disabled = true;
        $id('signup-password').disabled = true;
        $id('signup-password2').disabled = true;
    },

    stopQueue(buttonText) {
        SignUp.queue = false;
        $id('button-signup').innerHTML = buttonText;
        $id('signup-email').disabled = false;
        $id('signup-password').disabled = false;
        $id('signup-password2').disabled = false;
    }
};

const Verify = {
    queue: false,

    show() {
        $id('form-signup-inputs').style.display = 'none';
        $id('form-signup-verify').style.display = 'block';
    },

    back() {
        $id('form-signup-inputs').style.display = 'block';
        $id('form-signup-verify').style.display = 'none';

        $id('verify-email').value = '';
        $id('verify-code').value = '';
    },

    validate() {
        const email = $id('verify-email').value;
        const code = $id('verify-code').value;

        this.verify(email, code);
    },

    verify(email, code) {
        Cognito.createCognitoUser(email).confirmRegistration(code, true, (err, result) => {
            if (!err)
                Verify.success(result);
            else
                Verify.failure(err);
        });
    },

    success() {
        this.stopQueue('Success');
        this.back();
        FormManager.chooseSection('signin');
    },

    failure() {
        this.stopQueue('Cannot verify code!');
        $id('button-verify').style.background = '#ff0000';
    },

    startQueue() {
        SignUp.queue = true;
        $id('button-verify').innerHTML = 'Please wait...';
        $id('button-verify').style.background = '#39557C';
        $id('signup-email').disabled = true;
        $id('signup-password').disabled = true;
        $id('signup-password2').disabled = true;
    },

    stopQueue(buttonText) {
        SignUp.queue = false;
        $id('button-verify').innerHTML = buttonText;
        $id('signup-email').disabled = false;
        $id('signup-password').disabled = false;
        $id('signup-password2').disabled = false;
    }
};

window.onload = () => {
    FormManager.init();
};
