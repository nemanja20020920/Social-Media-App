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
    btn.setAttribute('onclick', 'dislikePost(this)');
    likeThePost(post_id, btn, session_id);
};
//



//Unliking the post
const dislikePost = btn => {
    let post_id = btn.getAttribute('data-post_id');
    btn.setAttribute('onclick', 'likePost(this)');
    dislikeThePost(post_id, btn, session_id);
}
//

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
        async function commentPostSubmit() {
            let currentUser = new User();
            currentUser = await currentUser.get(session_id);
            let commentsFeed = post.querySelector('.comments-wrapper');
            let newComment = document.createElement('div');
            newComment.setAttribute('data-post_id', post_id);
            newComment.setAttribute('data-user_id', session_id);
            newComment.setAttribute('data-comment_id', comment.id);
            newComment.className = 'single-comment';
            newComment.innerHTML = `<div class="comment-author d-flex align-items-center justify-content-start gap-2">
            <img src="slike/profile-picture.jpg" alt="Profile picture">
            <h4>${currentUser.username}</h4>
            </div>
            <div class="comment-content">
            <p>${comment.content}</p>
            </div>
            <div class="comment-actions d-flex align-items-center justify-content-end">
            <button type="button" class="btn btn-danger btn-sm" id="delete-comment-btn" data-comment_id="" onclick="deleteComment(this)"><i class="bi bi-trash"></i></button>
            </div>`
            commentsFeed.appendChild(newComment);
        }
        commentPostSubmit();
        form.reset();
    } else {
        alertPopUp('Form invalid!');
    }
};

//Deleting the comment
const deleteComment = btn => {
    let commentEl = btn.closest('.single-comment');
    let comment_id = commentEl.getAttribute('data-comment_id');
    let comment = new Comment();
    comment.delete(comment_id);
    commentEl.remove();
};

//Deleting the user
const deleteUser = btn => {

    if(confirm('Are you sure that you want to delete your profile?')) {
        let user = new User();
        user.id = session_id;
        user.delete();
    }
};
//
