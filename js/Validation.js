class Validation {
    constructor(config, formID) {
        this.configElements = config;
        this.formID = formID;
        this.errors = {};

        this.generateErrorsObject();
        this.inputListener();
    }

    generateErrorsObject() {
        for(let key in this.configElements) {
            this.errors[key] = [];
        }
    }

    inputListener() {
        for(let key in this.configElements) {
            let element = document.querySelector(`${this.formID} input[name="${key}"]`);
            element.addEventListener('input', this.validate.bind(this));
        }
    }

    validate(e) {
        let configObj = this.configElements;

        const field = e.target;
        const fieldName = field.getAttribute('name');
        const fieldValue = field.value;

        this.errors[fieldName] = [];

        if(configObj[fieldName].required) {
            if(!fieldValue) {
                this.errors[fieldName].push('This field is required!');
            }
        }

        if(configObj[fieldName].minLength > fieldValue.length) {
            this.errors[fieldName].push(`Minimum ${configObj[fieldName].minLength} characters required!`);
        }

        if(configObj[fieldName].maxLength < fieldValue.length) {
            this.errors[fieldName].push(`Maximum ${configObj[fieldName].maxLength} characters allowed!`);
        }

        if(configObj[fieldName].email) {
            if(!this.validEmail(fieldValue)) {
                this.errors[fieldName].push('Email address invalid!');
            }
        }

        /*if(configObj[fieldName].password) {
            if(!this.validPassword(fieldValue)) {
                this.errors[fieldName].push('Minimum eight characters, at least one uppercase letter, one lowercase letter and one number!');
            }
        }*/

        if(configObj[fieldName].matching) {
            let matchingEl = document.querySelector(`${this.formID} input[name="${configObj[fieldName].matching}"]`);
            if(fieldValue != matchingEl.value) {
                this.errors[fieldName].push(`Passwords do not match!`);
            }

            if(this.errors[fieldName].length == 0) {
                this.errors[fieldName] = [];
                this.errors[configObj[fieldName].matching] = [];
            }
        }

        this.populateErrors();
    }

    /*validPassword(password) {
        if(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
            return true;
        }
        return false;
    }*/

    validEmail(email) {
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true;
        }
        return false;
    }

    populateErrors() {
        for(let elem of document.querySelectorAll('ul')) {
            elem.remove();
        }

        for(let key in this.errors) {
            document.querySelector(`${this.formID} input[name="${key}"]`).classList.remove('is-invalid');
        }

        for(let key in this.errors) {
            let parentElement = document.querySelector(`${this.formID} input[name="${key}"]`).parentElement;
            let ul = document.createElement('ul');
            parentElement.appendChild(ul);
            this.errors[key].forEach(error => {
                let li = document.createElement('li');
                li.innerText = error;
                ul.appendChild(li);
                document.querySelector(`${this.formID} input[name="${key}"]`).classList.add('is-invalid');
            });
        }
    }

    validationPassed() {
        let errors;
        for(let key in this.errors) {
            if(this.errors[key].length > 0) {
                errors = 1;
            }
        }
        if(errors) return false;
        return true;
    }
}