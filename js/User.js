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
                let alertBox = document.querySelector('div[role="alert"]');
                alertBox.innerHTML = `<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                <div>
                  Username or email already taken!
                </div>`;
                alertBox.style.transform = 'translate(-50%, 10%)';
                setTimeout(() => {
                    alertBox.style.transform = 'translate(-50%, -20vh)';
                }, 2000);
            } else {
                user.create();
                form.reset();
            }
        });
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
        let userExists = false;
        fetch(this.api_url + '/users').then(response => response.json()).then(data => {
            data.forEach(user => {
                if(user.email === this.email && user.password === this.password) userExists = true;
                if(userExists) {
                    let session = new Session();
                    session.user_id = user.id;
                    session.startSession();
                    window.location.href = 'nmedia.html';
                }
            });
            
            if(!userExists) {
                let alertBox = document.querySelector('div[role="alert"]');
                alertBox.innerHTML = `<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                <div>
                  Wrong email or username!
                </div>`;
                alertBox.style.transform = 'translate(-50%, 10%)';
                setTimeout(() => {
                    alertBox.style.transform = 'translate(-50%, -20vh)';
                }, 2000);
            }
        });
    }
}