class User {
    user_id = '';
    username = '';
    email = '';
    password = '';
    api_url = 'https://62c44990abea8c085a71ae59.mockapi.io';

    validateUserRegistration(user, form) {
        let userExists = false;
        fetch(this.api_url + '/users').then(response => response.json()).then(data => {
            data.forEach(user => {
                if(user.username === this.username) userExists = true;
            });
            if(userExists) {
                alertPopUp('Username or email already taken!');
            } else {
                user.create();
                form.reset();
            }
        });
    }

    validateUserEdit(user_id) {
        let userExists = false;
        let alertPopUpText;
        fetch(this.api_url + '/users').then(response => response.json()).then(data => {
            data.forEach(user => {
                if(user.id != user_id) {
                    if(user.username === this.username || user.email === this.email) {
                        userExists = true;
                        alertPopUpText = 'Username or email already taken!';
                    }
                } 
                if(user.id == user_id) {
                    if(user.username === this.username && user.email === this.email) {
                        userExists = true;
                        alertPopUpText = 'You must change at least one value!';
                    }
                }
            });
            if(!userExists) {
                this.edit(user_id);
            } else {
                alertPopUp(alertPopUpText);
            }
        })
    }

    create() {
        let data = {
            username: this.username,
            email: this.email,
            password: this.password
        };

        data = JSON.stringify(data);


        fetch(this.api_url + '/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        }).then(response => response.json()).then(data => {
            let session = new Session();
            session.user_id = data.id;
            session.startSession();
            window.location.href = 'nmedia.html';
        });
    }

    login() {
        fetch(this.api_url + '/users').then(response => response.json()).then(data => {
            let userExists = false;
            data.forEach(user => {
                if(user.email === this.email && user.password === this.password) {
                    let session = new Session();
                    session.user_id = user.id;
                    session.startSession();
                    window.location.href = 'nmedia.html';
                    userExists = true;
                }
            });
            
            if(!userExists) {
                alertPopUp('Wrong email or username!');
            }
        });
    }

    async get(user_id) {
        let response = await fetch(this.api_url + '/users/' + user_id);
        let data = await response.json();
        return data;
    }

    edit(user_id) {
        let data = {
            username: this.username,
            email: this.email
        }
        data = JSON.stringify(data);

        fetch(this.api_url + '/users/' + user_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        }).then(response => response.json()).then(data => {
            window.location.href = 'nmedia.html';
            console.log(data);
        });
    }
}