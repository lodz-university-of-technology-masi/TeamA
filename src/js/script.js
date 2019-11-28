
// /*
//  *  Cognito Trash
//  */



// /*
//  *  Functions
//  */


// function signin(email, password, onSuccess, onFailure) {

//     console.log(email + "   " + password)
//     let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
//         Username: email,
//         Password: password
//     });

//     let cognitoUser = createCognitoUser(email);
//     cognitoUser.authenticateUser(authenticationDetails, {
//         onSuccess: onSuccess,
//         onFailure: onFailure
//     });
// }

// function createCognitoUser(email) {
//     return new AmazonCognitoIdentity.CognitoUser({
//         Username: email,
//         Pool: userPool
//     });
// }

// function register(email, password, onSuccess, onFailure) {

//     let dataEmail = {
//         Name: 'email',
//         Value: email
//     };
//     let attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

//     userPool.signUp(email, password, [attributeEmail], null,
//         function signUpCallback(err, result) {
//             if (!err) {
//                 onSuccess(result);
//             } else {
//                 onFailure(err);
//             }
//         }
//     );
// }

// function verify(email, code, onSuccess, onFailure) {
//     createCognitoUser(email).confirmRegistration(code, true, function confirmCallback(err, result) {
//         if (!err) {
//             onSuccess(result);
//         } else {
//             onFailure(err);
//         }
//     });
// }

// /*
//  *  Event Handlers
//  */

// $(function onDocReady() {
//     $('#signinForm').submit(handleSignin);
//     $('#registrationForm').submit(handleRegister);
//     $('#verifyForm').submit(handleVerify);
// });

// function handleSignin(event) {
//     let email = $('#emailInputSignin').val();
//     let password = $('#passwordInputSignin').val();
//     event.preventDefault();
//     signin(email, password,
//         function signinSuccess(result) {
//             console.log('Successfully Logged In');
//             console.log(createCognitoUser(email).getUsername().split("@"));
//             setCookie("user", createCognitoUser(email).getUsername().split("@")[0], 365);
//             setCookie("token", result.getAccessToken().getJwtToken(), 365);
//             window.location.href = 'home.html', true;  //<======= link do dalszej strony po zalogowaniu
//         },
//         function signinError(err) {
//             alert(err);
//         }
//     );
// }

// function handleRegister(event) {
//     let email = $('#emailInputRegister').val();
//     let password = $('#passwordInputRegister').val();
//     let password2 = $('#password2InputRegister').val();

//     let onSuccess = function registerSuccess(result) {
//         let cognitoUser = result.user;
//         console.log('user name is ' + cognitoUser.getUsername());
//         let confirmation = ('Registration successful. Please check your email inbox or spam folder for your verification code.');
//         if (confirmation) {
//             window.location.href = 'verify.html', true;
//         }
//     };
//     let onFailure = function registerFailure(err) {
//         alert(err);
//     };
//     event.preventDefault();

//     if (password === password2) {
//         register(email, password, onSuccess, onFailure);
//     } else {
//         alert('Passwords do not match');
//     }
// }

// function handleVerify(event) {
//     let email = $('#emailInputVerify').val();
//     let code = $('#codeInputVerify').val();
//     event.preventDefault();
//     verify(email, code,
//         function verifySuccess(result) {
//             console.log('call result: ' + result);
//             console.log('Successfully verified');
//             alert('Verification successful. You will now be redirected to the login page.');
//             window.location.href = "index.html", true;
//         },
//         function verifyError(err) {
//             alert(err);
//         }
//     );
// }










// function setCookie(cname, cvalue, exdays) {
//     var d = new Date();
//     d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
//     var expires = "expires=" + d.toUTCString();
//     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
// }

// function getCookie(cname) {
//     var name = cname + "=";
//     var ca = document.cookie.split(';');
//     for (var i = 0; i < ca.length; i++) {
//         var c = ca[i];
//         while (c.charAt(0) == ' ') {
//             c = c.substring(1);
//         }
//         if (c.indexOf(name) == 0) {
//             return c.substring(name.length, c.length);
//         }
//     }
//     return "";
// }

// function checkCookie() {
//     var user = getCookie("username");
//     if (user != "") {
//         alert("Welcome again " + user);
//     } else {
//         user = prompt("Please enter your name:", "");
//         if (user != "" && user != null) {
//             setCookie("username", user, 365);
//         }
//     }
// }