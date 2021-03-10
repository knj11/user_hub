const BASE_URL = "https://jsonplace-univclone.herokuapp.com";
// Can build str like this... `${ BASE_URL }/users`

function fetchUsers() {
  return fetch(`${BASE_URL}/users`)
    .then( response => response.json())
    .catch( error => console.log(error));
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
  console.log($(this).closest(".user-card").data("user"));
  // load albums for this user
  // render albums for this user
});
