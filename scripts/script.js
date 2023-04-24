const headerHome = document.querySelector(".header-home");
const headerArtist = document.querySelector(".header-artist");
const headerVisitor = document.querySelector(".header-visitor");
const joinAsArtist = document.querySelector(".join__artist");
const homePage = document.querySelector("#homePage");
const visitorHomePage = document.querySelector("#visitorHomePage");
const visitorListings = document.querySelector("#visitorListings");
const auctionPage = document.querySelector("#auctionPage");
const artistHomePage = document.querySelector("#artistHomePage");
const artistsItems = document.querySelector("#artistsItems");
const takeSnapshot = document.querySelector("#takeSnapshot");

function setDisplayNoneToHeaders() {
  headerHome.style.display = "none";
  headerArtist.style.display = "none";
  headerVisitor.style.display = "none";
}

function setDisplayNoneToContainers() {
  visitorHomePage.style.display = "none";
  homePage.style.display = "none";
  visitorListings.style.display = "none";
  auctionPage.style.display = "none";
  artistHomePage.style.display = "none";
  artistsItems.style.display = "none";
  takeSnapshot.style.display = "none";
}

function hashchange() {
  const hash = location.hash.slice(1);
  setDisplayNoneToContainers();
  setDisplayNoneToHeaders();
  document.querySelector(".nav").classList.remove("show-nav");

  if (hash === "") {
    initHomePage();

    headerHome.style.display = "flex";
    homePage.style.display = "block";
  } else {
    if (hash === "artists") {
      initArtistHomePage();
      artistHomePage.style.display = "block";
      headerArtist.style.display = "flex";
    } else if (hash === "visitor") {
      initVisitorHomePage();
      headerVisitor.style.display = "flex";
      visitorHomePage.style.display = "block";
    } else if (hash === "visitor/listing") {
      headerVisitor.style.display = "flex";
      visitorListings.style.display = "block";
      initVisitorListings();
    } else if (hash === "auction") {
      auctionPage.style.display = "block";
      headerVisitor.style.display = "flex";
      initAuctionPage();
    } else if (hash === "artists/items") {
      initArtistsItems();
      headerArtist.style.display = "flex";
      artistsItems.style.display = "block";
    } else if (hash === "captureImage") {
      takeSnapshot.style.display = "block";
      headerArtist.style.display = "flex";
      initTakeSnapshot();
    }
  }
}

window.addEventListener("hashchange", hashchange);
window.addEventListener("load", hashchange);
