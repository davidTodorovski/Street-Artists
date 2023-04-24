let selectedArtist;
let userType = localStorage.getItem("userType") || "";

function initHomePage() {
  const joinAsVisitor = document.querySelector(".join__visitor");
  const selectArtist = document.querySelector("#artistSelect");

  fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.json())
    .then((data) => {
      artists = data;

      selectArtist.innerHTML = '<option value="">Choose</option>';
      data.forEach((el) => {
        const { name } = el;
        const option = document.createElement("option");
        option.textContent = name;
        option.value = name;
        selectArtist.appendChild(option);
      });
    });

  joinAsVisitor.removeEventListener('click', joinInAsVisitor)
  joinAsArtist.removeEventListener('click', joinInAsArtist)
  joinAsVisitor.addEventListener("click", joinInAsVisitor);
  selectArtist.addEventListener("change", joinInAsArtist);
}

function joinInAsVisitor() {

  window.location.hash = "visitor";
  localStorage.setItem("userType", "visitor");
  userType = "visitor";
}

function joinInAsArtist(e) {
  window.location.hash = "artists";
  selectedArtist = e.target.value;
  localStorage.setItem("userType", "artist");

  localStorage.removeItem("currentArtist");
  userType = "artist";
}
