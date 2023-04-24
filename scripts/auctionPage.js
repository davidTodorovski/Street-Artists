const auctionContainer = document.querySelector(".auction-item-container");
const imageContainer = document.querySelector(".image-container");
const itemDetailsContainer = document.querySelector(".item-details-container");
const biddingAmounts = document.querySelector(".bidding-amounts");
const auctioningImage = document.querySelector(".auctioning-image");
const auctionArtist = document.querySelector(".auctioning-item-artist");
const auctionItemDescription = document.querySelector(
  ".auctioning-item-description"
);
const auctionItemTitle = document.querySelector(".auctioning-item-title");
const progressBar = document.querySelector(".progress-bar");
const placeBidBtn = document.querySelector(".place-bid-button");
const minBid = document.querySelector(".min-bid");
const auctioningTimer = document.querySelector(".auctioning-timer");
const bidAmount = document.querySelector(".bid-amount");
const auctionPageContainer = document.querySelector(".auction-page-container");
const auctionError = document.querySelector(".auction-error");

const AUC_TIME = 120;
let timer;
let time;
let biddingAmount = localStorage.getItem("biddingAmount") || "";
let auctioningItem;
let bidState = JSON.parse(localStorage.getItem("bidState")) || false;

function initAuctionPage() {
  auctioningItem = items.find((item) => item.isAuctioning);
  if (typeof auctioningItem !== "undefined") {
    auctionPageContainer.style.display = "block";
    auctionError.style.display = "none";
    if (timer) clearInterval(timer);
    timer = startAuctionTimer();
    const biddingAmountsLS = JSON.parse(
      localStorage.getItem("biddingAmountsLS")
    );
    if (biddingAmountsLS) {
      biddingAmounts.innerHTML = biddingAmountsLS;
    } else {
      biddingAmounts.innerHTML = "";
    }

    renderAuctionItem(auctioningItem);
  } else {
    auctionPageContainer.style.display = "none";
    auctionError.style.display = "block";
  }

  // Remove events
  placeBidBtn.removeEventListener("click", placeBid);

  // Events
  placeBidBtn.addEventListener("click", placeBid);
}

function renderAuctionItem(item) {
  auctioningImage.src = item.image;
  auctionItemDescription.textContent = item.description;
  auctionArtist.textContent = item.artist;
  auctionItemTitle.textContent = item.title;

  minBid.textContent = biddingAmount
    ? `$${+biddingAmount + 15}`
    : `$${Math.floor(item.price / 2)}`;
}

const startAuctionTimer = function () {
  time = localStorage.getItem("time") || 120;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    auctioningTimer.textContent = `${min}:${sec}`;
    progressBar.style.width = (time / 120) * 100 + "%";
   
    if (time === 0) {
      clearInterval(timer);
      biddingAmounts.innerHTML += `
     <p class="bidding-finished">Bidding finished</p>
     `;

      localStorage.removeItem("time");

      bidState = false;
      localStorage.setItem("bidState", bidState);
      auctioningItem.isAuctioning = false;
      if (biddingAmount) {
        auctioningItem.priceSold = +biddingAmount;
        auctioningItem.dateSold = new Date().toISOString();
      }
      localStorage.setItem("items", JSON.stringify(items));

      localStorage.removeItem("biddingAmount");
      localStorage.removeItem("biddingAmountsLS");
      localStorage.removeItem("bidState");
      biddingAmount = "";
    } else {
      localStorage.setItem("time", time);
      time--;
    }

    if (time <= 50 && time > 20) {
      progressBar.classList.add("warning");
    } else if (time <= 20) {
      progressBar.classList.add("danger");
    }
  };

  tick();
  const returnTimer = setInterval(tick, 1000);
  return returnTimer;
};

const onBidSuccess = (data) => {
  if (data.isBidding) {
    time = 120;

    localStorage.setItem("time", JSON.stringify(time));
    if (timer) clearInterval(timer);
    timer = startAuctionTimer();
  
    progressBar.classList.remove("warning");
    progressBar.classList.remove("danger");

    biddingAmount = data.bidAmount;
    minBid.textContent = `$${+data.bidAmount + 15}`;
    localStorage.setItem("biddingAmount", biddingAmount);
    bidAmount.value = +data.bidAmount + 15;
    biddingAmounts.innerHTML += `
     <p class="theirBid">Their bid amount: $${+data.bidAmount}</p>
     `;

    localStorage.setItem(
      "biddingAmountsLS",
      JSON.stringify(biddingAmounts.innerHTML)
    );

    bidState = true;
    localStorage.setItem("bidState", JSON.stringify(bidState));
  } else {
    // placeBidBtn.disabled = true;
    bidState = false;
    localStorage.setItem("bidState", JSON.stringify(bidState));

    localStorage.setItem(
      "biddingAmountsLS",
      JSON.stringify(biddingAmounts.innerHTML)
    );
  }
};

function placeBid() {
  const bidAmountValue = bidAmount.value;
  if (
    +bidAmountValue < auctioningItem.price / 2 ||
    +bidAmountValue < +biddingAmount + 15 ||
    !bidState ||
    userType === "artist"
  )
    return;

  biddingAmount = bidAmountValue;
  localStorage.setItem("biddingAmount", biddingAmount);
  // minBid.textContent = `$${+biddingAmount + 15}`;
  biddingAmounts.innerHTML += `
       <p class="myBid">Your bid amount: $${bidAmountValue}</p>
       `;

  localStorage.setItem(
    "biddingAmountsLS",
    JSON.stringify(biddingAmounts.innerHTML)
  );

  fetch("https://blooming-sierra-28258.herokuapp.com/bid", {
    method: "POST",
    body: JSON.stringify({ amount: bidAmountValue }),

    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(onBidSuccess);
  bidAmount.value = "";
  bidState = false;
  localStorage.setItem("bidState", JSON.stringify(bidState));
}


