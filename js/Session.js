class Session {
    user_id = '';

    startSession() {
        let date = new Date();
        date.setTime(date.getTime() + (1*24*60*60*1000));
        let expires = ';expires=' + date.toUTCString();
        document.cookie = 'user_id=' + this.user_id + expires;
    }

    getSession() {
        let name = 'user_id=';
        let cookie = document.cookie.split(';');

        for(let part = 0; part < cookie.length; part++) {
            while(cookie[part].charAt(0) === ' ') {
                cookie[part] = cookie[part].substring(1);
            }
            if(cookie[part].indexOf(name) == 0) {
                return cookie[part].substring(name.length, cookie[part].length);
            }
        }
        return '';
    }

    destroySession() {
        let cookies = document.cookie.split(';');

        for(let index = 0; index < cookies.length; index++) {
            let cookie = cookies[index];
            let eqPos = cookie.indexOf("=");
            let name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        window.location.href = '/';
    }
}