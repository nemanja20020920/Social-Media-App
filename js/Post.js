class Post {
    user_id = '';
    content = '';
    likes = 0;
    liked = [];
    api_url = 'https://62c44990abea8c085a71ae59.mockapi.io';

    async create() {
        let data = {
            user_id: this.user_id,
            content: this.content,
            likes: this.likes,
            liked: this.liked
        }
        data = JSON.stringify(data);

        let response = await fetch(this.api_url + '/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });

        data = await response.json();
        
        return data;
    }

    delete() {
        fetch(this.api_url + '/posts/' + this.id, {
            method: 'DELETE'
        }).then(response => response.json()).then(data => data);
    }

    async like() {
        let response = await fetch(this.api_url + '/posts/' + this.id);
        let data = await response.json();

        let likes = data.likes;
        likes++;
        let liked = data.liked;

        if(!liked) {
            liked = [this.user_id];
        } else {
            liked.push(this.user_id);
        }

        data = {
            likes: likes,
            liked: liked
        }

        data = JSON.stringify(data);
        response = await fetch(this.api_url + '/posts/' + this.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });
        data = await response.json();

        return data;
    }

    async getPosts() {
        let response = await fetch(this.api_url + '/posts');
        let data = response.json();
        return data;
    }

    async dislike() {
        let response = await fetch(this.api_url + '/posts/' + this.id);
        let data = await response.json();

        let likes = data.likes;
        likes--;
        
        let liked = data.liked;
        liked.pop(this.user_id);

        data = {
            likes: likes,
            liked: liked
        }

        data = JSON.stringify(data);
        response = await fetch(this.api_url + '/posts/' + this.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });
        data = await response.json();

        return data;
    }
}