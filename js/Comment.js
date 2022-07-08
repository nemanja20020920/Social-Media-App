class Comment {
    post_id = '';
    user_id = '';
    content = '';
    api_url = 'https://62c44990abea8c085a71ae59.mockapi.io';

    create() {
        let data = {
            post_id: this.post_id,
            user_id: this.user_id,
            content: this.content
        }
        data = JSON.stringify(data);

        fetch(this.api_url + '/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        }).then(response => response.json()).then(data => data);
    }

    async get(post_id ) {
        let comments = [];
        let index = 0;
        let response = await fetch(this.api_url + '/comments');
        let data = await response.json();
        data.forEach(comment => {
            if(comment.post_id == post_id) {
                comments[index] = comment;
                index++;
            }
        });
        return comments;
    }

    delete(comment_id) {
        fetch(this.api_url + '/comments/' + comment_id, {
            method: 'DELETE'
        }).then(response => response.json()).then(data => data);
    }
}