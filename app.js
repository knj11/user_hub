const BASE_URL = "https://jsonplace-univclone.herokuapp.com";
// Can build str like this... `${ BASE_URL }/users`

function fetchData(url) {
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

function fetchUsers() {
  return fetchData(`${BASE_URL}/users`);
}

function renderUser(user) {
  return $(`
  <div class="user-card">
    <header>
      <h2>${user.name}</h2>
    </header>
    <section class="company-info">
      <p><b>Contact:</b> ${user.email}</p>
      <p><b>Works for:</b> ${user.company.name}</p>
      <p><b>Company creed:</b> ${user.company.catchPhrase}</p>
    </section>
    <footer>
      <button class="load-posts">POSTS BY ${user.username}</button>
      <button class="load-albums">ALBUMS BY ${user.username}</button>
    </footer>
  </div>`).data("user", user);
}

function renderUserList(userList) {
  $("#user-list").empty();
  userList.forEach((element) => {
    $("#user-list").append(renderUser(element));
  });
}

/* get an album list, or an array of albums */
function fetchUserAlbumList(userId) {
  return fetchData(
    `${BASE_URL}/users/${userId}/albums?_expand=user&_embed=photos`
  );
}

/* render a single album */
function renderAlbum(album) {
  const albumCard = $(`
    <div class="album-card">
      <header>
        <h3>${album.title}, by ${album.user.username} </h3>
      </header>
      <section class="photo-list">
      </section>
    </div>
  `);
  for (let photo of album.photos) {
    albumCard.find(".photo-list").append(renderPhoto(photo));
  }
  return albumCard;
}

/* render a single photo */
function renderPhoto(photo) {
  return `
    <div class="photo-card">
      <a href="${photo.url}" target="_blank">
        <img src="${photo.thumbnailUrl}">
        <figure>${photo.title}</figure>
      </a>
    </div>
  `;
}

/* render an array of albums */
function renderAlbumList(albumList) {
  $("#app section.active").removeClass("active");
  $("#album-list").addClass("active").empty();
  albumList.forEach((el) => {
    $("#album-list").append(renderAlbum(el));
  });
}

function fetchUserPosts(userId) {
  return fetchData(`${BASE_URL}/users/${userId}/posts?_expand=user`);
}

function fetchPostComments(postId) {
  return fetchData(`${BASE_URL}/posts/${postId}/comments`);
}

function renderPost(post) {
  const postJQ = $(`
    <div class="post-card">
      <header>
        <h3>${post.title}</h3>
        <h3>--- ${post.user.username}</h3>
      </header>
      <p>${post.body}</p>
      <footer>
        <div class="comment-list"></div>
        <a href="#" class="toggle-comments">(<span class="verb">show</span> comments)</a>
      </footer>
    </div>
  `);
  postJQ.data("post", post);
  return postJQ;
}

function renderPostList(postList) {
  $("#app section.active").removeClass("active");
  $("#post-list").addClass("active").empty();
  postList.forEach((el) => {
    $("#post-list").append(renderPost(el));
  });
}

function setCommentsOnPost(post) {
  // post.comments might be undefined, or an []
  // if undefined, fetch them then set the result
  // if defined, return a rejected promise
  // if we already have comments, don't fetch them again
  if (post.comments) {
    // #1: Something goes here
    return Promise.reject(null);
  }

  // fetch, upgrade the post object, then return it
  return fetchPostComments(post.id).then(function (comments) {
    post.comments = comments;
    return post;
    // #2: Something goes here
  });
}

function toggleComments(postCardElement) {
  const footerElement = postCardElement.find("footer");

  if (footerElement.hasClass("comments-open")) {
    footerElement.removeClass("comments-open");
    footerElement.find(".verb").text("show");
  } else {
    footerElement.addClass("comments-open");
    footerElement.find(".verb").text("hide");
  }
}

function bootstrap() {
  fetchUsers().then(renderUserList);
}

bootstrap();

$("#post-list").on("click", ".post-card .toggle-comments", function () {
  const postCardElement = $(this).closest(".post-card");
  const post = postCardElement.data("post");

  setCommentsOnPost(post)
    .then(function (post) {
      console.log("building comments for the first time...", post);
      postCardElement.find('.comment-list').empty()
      post.comments.forEach( comment => {
        postCardElement.find('.comment-list').append(`<h3>email: ${comment.email}, post: ${comment.body}</h3>`)
      })
      toggleComments(postCardElement)
    })
    .catch(function () {
      console.log("comments previously existed, only toggling...", post);
      toggleComments(postCardElement)
    });
});

$("#user-list").on("click", ".user-card .load-posts", function () {
  const userObj = $(this).closest(".user-card").data("user");
  fetchUserPosts(userObj.id).then(renderPostList);
  // load posts for this user
  // render posts for this user
});

$("#user-list").on("click", ".user-card .load-albums", function () {
  const userObj = $(this).closest(".user-card").data("user");
  fetchUserAlbumList(userObj.id).then(renderAlbumList);
  // load albums for this user
  // render albums for this user
});
