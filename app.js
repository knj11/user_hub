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

function bootstrap() {
  fetchUsers().then(renderUserList);
}

bootstrap();

$("#user-list").on("click", ".user-card .load-posts", function () {
  console.log($(this).closest(".user-card").data("user"));
  // load posts for this user
  // render posts for this user
});

$("#user-list").on("click", ".user-card .load-albums", function () {
  const userObj = $(this).closest(".user-card").data("user");
  fetchUserAlbumList(userObj.id).then(renderAlbumList);
  // load albums for this user
  // render albums for this user
});
