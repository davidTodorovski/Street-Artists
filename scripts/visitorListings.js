const openFilterNav = document.querySelector(".open-filter-nav");
const closeFilterNav = document.querySelector(".filter-nav__close-filter-nav");
const applyFilterOptionsBtn = document.querySelector(".filter-nav__apply");
const filterNav = document.querySelectorAll(".filter-nav");

const filterByArtist = document.querySelector("#filterByArtist");
const filterByType = document.querySelector("#filterByType");
const filterByTitle = document.querySelector("#filterByTitle");
const filterByMinPrice = document.querySelector("#filterByMinPrice");
const filterByMaxPrice = document.querySelector("#filterByMaxPrice");

let filtered 

const parentEl = document.querySelector(".artwork-container");
function initVisitorListings() {
 filtered = items.filter((item) => item.isPublished);
  renderArtwork(filtered);

  openFilterNav.removeEventListener("click", openFilterNavigation);
  closeFilterNav.removeEventListener("click", openFilterNavigation);
  applyFilterOptionsBtn.removeEventListener("click", applyFilterOptions);

  openFilterNav.addEventListener("click", openFilterNavigation);
  closeFilterNav.addEventListener("click", closeFilterNavigation);
  applyFilterOptionsBtn.addEventListener("click", applyFilterOptions);
}

function renderArtwork(arr) {
  parentEl.innerHTML = "";
  arr.forEach((element, idx) => {
    const { title, description, image, price, artist } = element;
    const markup = `
        <div class="preview-card">
        <div class="${
          idx % 2 === 0 ? "preview-card--bg-light" : "preview-card--bg-dark"
        }">
        <div class="preview-card__img-container">
        <img src="${image}" alt="${title}">
        </div>
        <div class="preview-card__details">
          <div>
            <p class="preview-card__artist-name">${artist}</p>
            <p class="preview-card__price">${price}$</p>
          </div>
          <p class="preview-card__item-title">${title}</p>
          <p class="preview-card__desc">${description}</p>
        </div>
        </div>
      </div>
        `;

    parentEl.innerHTML += markup;
  });

  fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.json())
    .then((data) => {
      artists = data;

      filterByArtist.innerHTML = '<option value="">Choose</option>';
      data.forEach((el) => {
        const { name } = el;
        const option = document.createElement("option");
        option.textContent = name;
        option.value = name;
        filterByArtist.appendChild(option);
      });
    });

  filterByType.innerHTML = '<option value="">Choose</option>';
  itemTypes.forEach((itemType) => {
    filterByType.innerHTML += `
      '<option value="${itemType}">${itemType}</option>'
      `;
  });
}

function clearFilterInputs() {
  filterByArtist.value = "";
  filterByMinPrice.value = "";
  filterByMaxPrice.value = "";
  filterByType.value = "";
  filterByTitle.value = "";
}

function openFilterNavigation() {
  filterNav.forEach((nav_el) => nav_el.classList.add("filter-visible"));
}

function closeFilterNavigation() {
  filterNav.forEach((nav_el) => nav_el.classList.remove("filter-visible"));
  clearFilterInputs();
}

function applyFilterOptions() {

  const byArtistValue = filterByArtist.value;
  const byTitleValue = filterByTitle.value.toLowerCase().split(" ").join("");
  const byMinPriceValue = filterByMinPrice.value;
  const byMaxPriceValue = filterByMaxPrice.value;
  const byTypeValue = filterByType.value;

  const filteredItems = filtered.filter((item) => {
    if (
      (byMinPriceValue === "" || item.price >= +byMinPriceValue) &&
      (byMaxPriceValue === "" || item.price <= +byMaxPriceValue) &&
      (byArtistValue === "" || item.artist === byArtistValue) &&
      (byTypeValue === "" || item.type === byTypeValue) &&
      (filterByTitle.value === "" ||
        item.title.toLowerCase().split(" ").join("").includes(byTitleValue))
    ) {
      return true;
    }
  });
  renderArtwork(filteredItems);
  filterNav.forEach((nav_el) => nav_el.classList.remove("filter-visible"));
  clearFilterInputs();
}
