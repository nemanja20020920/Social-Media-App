let session = new Session();
let session_id = session.getSession();

if(session_id === '') window.location.href = '/';

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
    }
};

let validation = new Validation(config, '#editForm');
//FORM VALIDATION END

//Display user data function call
displayUserData(session_id, 'user-data');

//Setting the edit values to default function call
setFormValuesDefault(session_id);

//Displaying the posts
displayPosts(session_id);

//Closing the edit popup modal
document.querySelector('.btn-close').addEventListener('click', e => {
    e.preventDefault();
    const registerModal = document.querySelector('.register-modal');
    registerModal.classList.add('closed');
    setFormValuesDefault(session_id);//sets the values to default again if nothing is changed
});

//Edit username and email
let editForm = document.querySelector('#editForm');
editForm.addEventListener('submit', e => {
    e.preventDefault();

    let newUsername = editForm.querySelector('input[name="username-register"]').value;
    let newEmail = editForm.querySelector('input[name="email-register"]').value;
    if(newUsername && newEmail) {
        let user = new User();
        user.username = newUsername;
        user.email = newEmail;
        user.validateUserEdit(session_id);
    } else {
        alertPopUp('Form invalid!');
    }
});

//Posting a post
let postForm = document.querySelector('#postForm');
postForm.addEventListener('submit', e => {
    e.preventDefault();
    let content = postForm.querySelector('#post-content').value;
    if(content) {
        let post = new Post();
        post.user_id = session_id;
        post.content = content;
        createPost(post, session_id);
    } else {
        alertPopUp('You have to write something!');
    }
    postForm.reset();
});

//Liking the post
const likePost = btn => {
    let post_id = btn.getAttribute('data-post_id');
    btn.setAttribute('disabled', 'disabled');
    getPostLikes(post_id, btn, session_id);
};

//Comments btn click
const displayComments = btn => {
    let post = btn.closest('.single-post');
    let post_id = post.getAttribute('data-post_id');
    let post_comments = post.querySelector('.post-comments');
    post_comments.classList.toggle('d-none');
};

//Commenting the post
const commentPost = e => {
    e.preventDefault();

    let btn = e.target;
    let form = btn.closest('#commentForm');
    let post = form.closest('.single-post');
    let post_id = post.getAttribute('data-post_id');
    let content = form.querySelector('textarea').value;
    if(content) {
        let comment = new Comment();
        comment.post_id = post_id;
        comment.user_id = session_id;
        comment.content = content;
        comment.create();
        commentPostSubmit(comment, post, post_id, session_id);
        form.reset();
    } else {
        alertPopUp('Form invalid!');
    }
}

//Deleting the comment
const deleteComment = btn => {
    let commentEl = btn.closest('.single-comment');
    let comment_id = commentEl.getAttribute('data-comment_id');
    let comment = new Comment();
    comment.delete(comment_id);
}