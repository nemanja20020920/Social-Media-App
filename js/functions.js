//FUNCTIONS

//Alert function that displays an alert with optional text
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
//



//Async function that generates user data onload
async function displayUserData(user_id, userDataPlaceholder) {
  let user = new User();
  user = await user.get(user_id);

  document.querySelector(`.${userDataPlaceholder}`).innerHTML = `
  <h1 id="feed-logo">Nmedia</h1>
  <img src="slike/profile-picture.jpg" alt="Profile picture" id="profile-picture">
  <span id="username-data">${user['username']}</span>
  <div class="user-actions mt-3 d-flex alig-items-center justify-content-evenly gap-3">
      <button class="btn btn-sm btn-outline-info d-flex align-items-center justify-content-center" id="editProfileBtn">Edit<i class="bi bi-pencil-square ms-1"></i></button>
      <button class="btn btn-sm btn-outline-dark d-flex align-items-center justify-content-center" id="logOutBtn">Logout<i class="bi bi-box-arrow-right ms-1"></i></button>
  </div>
  <div class="delete-user d-flex align-items-center justify-content-center">
    <button type="button" class="btn btn-outline-danger btn-sm" onclick="deleteUser(this)">Delete profile</button>
  </div>
  `; 
  
  let editProfileBtn = document.querySelector('#editProfileBtn');

  editProfileBtn.addEventListener('click', e => {
    e.preventDefault();

    document.querySelector('.register-modal').classList.remove('closed');
  });

  let logOutBtn = document.querySelector('#logOutBtn');

  logOutBtn.addEventListener('click', e => {
    e.preventDefault();

    let confirmationText = 'Are you sure that you want to log out?';
    
    if(confirm(confirmationText)) session.destroySession();
  });
}
//



//Setting default values 
async function setFormValuesDefault(user_id) {
  let username = document.querySelector('#editForm #username-register');
  let email = document.querySelector('#editForm #email-register');
  let user = new User();
  user = await user.get(user_id);
  username.value = user['username'];
  email.value = user['email'];
}
//



//Creating a post
async function createPost(post, user_id) {
  let user = new User();
  user = await user.get(user_id);
  post = await post.create();

  let postsFeed = document.querySelector('.posts');
  let newPost = document.createElement('div');
  newPost.className = 'single-post my-3';
  newPost.setAttribute('data-user_id', `${user_id}`);
  newPost.setAttribute('data-post_id', `${post.id}`);
  newPost.innerHTML = `
  <div class="user-info d-flex align-items-center justify-content-start gap-2">
    <img src="slike/profile-picture.jpg" alt="Profile picture">
    <h3>${user.username}</h3>
  </div>
  <div class="post-content">
    <p class="post-content-text">${post.content}</p>
  </div>
  <div class="post-actions d-flex align-items-center justify-content-end gap-3">
    <button type="button" class="btn btn-primary btn-sm" id="like-post-btn" data-post_id="${post.id}" onclick="likePost(this)">${post.likes} Likes <i class="bi bi-hand-thumbs-up"></i></button>
    <button type="button" class="btn btn-info btn-sm" id="see-comments-btn" data-post_id="${post.id}" onclick="displayComments(this)">Comments</button>
    <button type="button" class="btn btn-danger btn-sm" id="delete-post-btn" data-post_id="${post.id}" onclick="deletePost(this)"><i class="bi bi-trash"></i></button>
  </div>
  <div class="post-comments d-none">
    <div class="comments-form-wrapper">
      <form id="commentForm" class="d-flex flex-column justify-content-center gap-3">
        <div class="form-floating">
          <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
          <label for="floatingTextarea">Comment this post</label>
        </div>
        <button type="submit" class="btn btn-info btn-sm align-self-end" onclick="commentPost(this)">Comment!</button>
      </form>
    </div>
    <div class="comments-wrapper mt-3 p-2">
    </div>
  </div>
  `;
  postsFeed.appendChild(newPost);
  setTimeout(() => {
    newPost.style.transform = 'translateX(0)';
  }, 100);
}
//



//Delete post function
const deletePost = btn => {
  let postElement = btn.closest('.single-post');
  let post_id = btn.getAttribute('data-post_id');
  let post = new Post();
  post.id = post_id;
  post.delete();
  postElement.remove();
}
//



//Like post functions
async function likeThePost(post_id, likeBtn, session_id) {
  let post = new Post();
  post.user_id = session_id;
  post.id = post_id;
  post = await post.like();
  likeBtn.innerHTML = `${post.likes} Likes <i class="bi bi-hand-thumbs-up"></i>`;
}
//



//Dislike post functions
async function dislikeThePost(post_id, likeBtn, session_id) {
  let post = new Post();
  post.user_id = session_id;
  post.id = post_id;
  post = await post.dislike();
  likeBtn.innerHTML = `${post.likes} Likes <i class="bi bi-hand-thumbs-up"></i>`;
}



//Async functions that generate posts on load
async function displayPosts(session_id) {
  let allPosts = new Post();
  allPosts = await allPosts.getPosts();
  allPosts.forEach(post => {
    generatePosts(post, session_id);
  });
}

async function generatePosts(post, session_id) {
  let postCreator = new User();
  postCreator = await postCreator.get(post.user_id);


  let comments = new Comment();
  comments = await comments.get(post.id);
  let commentsHTML = ``;
  for(let comment of comments) {

    let commentAuthor = new User();
    commentAuthor = await commentAuthor.get(comment.user_id);
    if(commentAuthor.id == session_id) {
    commentsHTML += `
      <div class="single-comment" data-user_id="${comment.user_id}" data-post_id="${comment.post_id}" data-comment_id="${comment.id}">
        <div class="comment-author d-flex align-items-center justify-content-start gap-2">
          <img src="slike/profile-picture.jpg" alt="Profile picture">
          <h4>${commentAuthor.username}</h4>
        </div>
        <div class="comment-content">
          <p>${comment.content}</p>
        </div>
        <div class="comment-actions d-flex align-items-center justify-content-end">
          <button type="button" class="btn btn-danger btn-sm" id="delete-comment-btn" data-comment_id="" onclick="deleteComment(this)"><i class="bi bi-trash"></i></button>
        </div>
      </div>
    `;
    } else {
      commentsHTML += `
      <div class="single-comment" data-user_id="${comment.user_id}" data-post_id="${comment.post_id}" data-comment_id="${comment.id}">
        <div class="comment-author d-flex align-items-center justify-content-start gap-2">
          <img src="slike/profile-picture.jpg" alt="Profile picture">
          <h4>${commentAuthor.username}</h4>
        </div>
        <div class="comment-content">
          <p>${comment.content}</p>
        </div>
      </div>
    `
    }

  }

  let postsFeed = document.querySelector('.posts');
  let newPost = document.createElement('div');
  newPost.className = 'single-post my-3';
  newPost.setAttribute('data-user_id', `${post.user_id}`);
  newPost.setAttribute('data-post_id', `${post.id}`);

  let likesBtnHTML = `<button type="button" class="btn btn-primary btn-sm" id="like-post-btn" data-post_id="${post.id}" onclick="likePost(this)">${post.likes} Likes <i class="bi bi-hand-thumbs-up"></i></button>`;
  let deleteBtnHTMl = ``;
  if(post.liked.includes(session_id)) {
    likesBtnHTML = `<button type="button" class="btn btn-primary btn-sm" id="like-post-btn" data-post_id="${post.id}" onclick="dislikePost(this)">${post.likes} Likes <i class="bi bi-hand-thumbs-up"></i></button>`
  }
  if(post.user_id === session_id) {
    deleteBtnHTMl = `
    <button type="button" class="btn btn-danger btn-sm" id="delete-post-btn" data-post_id="${post.id}" onclick="deletePost(this)"><i class="bi bi-trash"></i></button>`;
  }
  newPost.innerHTML = `
  <div class="user-info d-flex align-items-center justify-content-start gap-2">
    <img src="slike/profile-picture.jpg" alt="Profile picture">
    <h3>${postCreator.username}</h3>
  </div>
  <div class="post-content">
    <p class="post-content-text">${post.content}</p>
  </div>
  <div class="post-actions d-flex align-items-center justify-content-end gap-3">
    ${likesBtnHTML}
    <button type="button" class="btn btn-info btn-sm" id="see-comments-btn" data-post_id="${post.id}" onclick="displayComments(this)">Comments</button>
    ${deleteBtnHTMl}
  </div>
  <div class="post-comments d-none">
    <div class="comments-form-wrapper">
      <form id="commentForm" class="d-flex flex-column justify-content-center gap-3">
        <div class="form-floating">
          <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
          <label for="floatingTextarea">Comment this post</label>
        </div>
        <button type="submit" class="btn btn-info btn-sm align-self-end" onclick="commentPost(event)">Comment!</button>
      </form>
    </div>
    <div class="comments-wrapper mt-3 p-2">
      ${commentsHTML}
    </div>
  </div>
  `;

  postsFeed.appendChild(newPost);
  setTimeout(() => {
    newPost.style.transform = 'translateX(0)';
  }, 1);
}
//