let session = new Session();
let session_id = session.getSession();

if(session_id != '') window.location.href = 'nmedia.html';


//FUNCTIONS

const alertPopUp = alertText => {
    let alertBox = document.querySelector('div[role="alert"]');
    alertBox.innerHTML = `<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
    <div>
      ${alertText}
    </div>`;
    alertBox.style.transform = 'translate(-50%, 10%)';
    setTimeout(() => {
        alertBox.style.transform = 'translate(-50%, -20vh)';
    }, 2000);
}


//ONLOAD ANIMATIONS BEGINING
window.addEventListener('load', () => {
    const logo = document.querySelector('.logo > h1');
    let description = document.querySelector('#description-text');
    let descriptionText = description.innerText;
    let left = descriptionText.slice(0, 10);
    let right = descriptionText.slice(11);
    description.innerHTML = `<span id="left-description">${left}</span> <span id="right-description">${right}</span>`;
    setTimeout(() => {
        logo.style.transform = 'translateY(0px)';
        logo.style.opacity = '1';
        document.querySelector('#left-description').style.transform = 'translateX(0)';
        document.querySelector('#right-description').style.transform = 'translateX(0)';
    }, 300);
});
//ONLOAD ANIMATIONS END



//BACKGROUND CHANGE BEGINING
const backgrounds = [
    "./slike/background1.jpg",
    "./slike/background2.jpg",
    "./slike/background3.jpg"
]
  
const body = document.querySelector('.app-body');

let index = 0;

const changeBackground = () => {
    body.style.backgroundImage = `url('${backgrounds[index]}')`;
    index++;
    if(index == backgrounds.length) index = 0;
}

setInterval(() => changeBackground(), 4000);
//BACKGROUND CHANGE END



//REGISTER MODAL POPUP BEGINING
document.querySelector('#registerBtn').addEventListener('click', e => {
    e.preventDefault();
    const registerModal = document.querySelector('.register-modal');
    registerModal.classList.remove('closed');
});

document.querySelector('.btn-close').addEventListener('click', e => {
    e.preventDefault();
    const registerModal = document.querySelector('.register-modal');
    registerModal.classList.add('closed');
});
//REGISTER MODAL POPUP END



//FORM VALIDATION BEGINING
const config = {
    'username-register': {
        required: true,
        minLength: 3,
        maxLength: 30
    },
    'email-register': {
        required: true,
        email: true
    },
    'password-register': {
        required: true,
        minLength: 5,
        maxLength: 30,
        matching: 'password-repeat-register'
    },
    'password-repeat-register': {
        required: true,
        matching: 'password-register'
    }
};

let validation = new Validation(config, '#registerForm');
//FORM VALIDATION END 

let registerForm = document.querySelector('#registerForm');

registerForm.addEventListener('submit', e => {
    e.preventDefault();
    let password = document.querySelector('#registerForm input[name="password-register"]').value;
    let username = document.querySelector('#registerForm input[name="username-register"]').value;
    let email = document.querySelector('#registerForm input[name="email-register"]').value;

    if(validation.validationPassed() && username && email && password) {
        let user = new User();
        user.username = username;
        user.email = email;
        user.password = password;
        user.validateUserRegistration(user, registerForm);
    } else {
        alertPopUp('Form invalid!');
    }
});

let loginForm = document.querySelector('#loginForm');

loginForm.addEventListener('submit', e => {
    e.preventDefault();
    let email = loginForm.querySelector('#login-email').value;
    let password = loginForm.querySelector('#login-password').value;

    if(email && password) {
        let user = new User();
        user.email = email;
        user.password = password;
        user.login();
    } else {
        alertPopUp('Form invalid!');
    }
});