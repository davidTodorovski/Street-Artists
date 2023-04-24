const headingArtist = document.querySelector(".header-artist .heading");
const menuBtn = document.querySelector("#menu-toggle");
const nav = document.querySelector(".nav");
const totalItemsSold = document.querySelector(".summary__value--sold");
const totalIncome = document.querySelector(".summary__value--total");
const currentBid = document.querySelector(".summary__value--cur-bid");
const canvas = document.querySelector("#myCanvas");
const chartContainer = document.querySelector('.chart-container')
const chartBtns = document.querySelectorAll(".income-chart__btn");
const last7 = document.querySelector("#last7");
const last14 = document.querySelector("#last14");
const last30 = document.querySelector("#last30");
const last365 = document.querySelector("#last365");
const summaryContainer = document.querySelector(".summary__bidding");

let currentArtist = JSON.parse(localStorage.getItem("currentArtist")) || "";
let itemsSold;
let myChart;
let currentAccount;

function initArtistHomePage() {
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.json())
    .then((users) => {
      if (!localStorage.getItem("currentArtist")) {
        currentArtist = users.find((el) => el.name === selectedArtist);
        localStorage.setItem("currentArtist", JSON.stringify(currentArtist));
      }

      currentAccount = items.filter(
        (item) => item.artist === currentArtist.name
      );

      headingArtist.textContent = currentArtist.name;
    
      calcSummary(currentAccount);
      renderChart();
    });

  // Remove events
  last7.removeEventListener("click", showLast7Days);
  last14.removeEventListener("click", showLast14Days);
  last30.removeEventListener("click", showLastMonth);
  last365.removeEventListener("click", showLastYear);

  // Events
  last7.addEventListener("click", showLast7Days);
  last14.addEventListener("click", showLast14Days);
  last30.addEventListener("click", showLastMonth);
  last365.addEventListener("click", showLastYear);
}

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("show-nav");
});

function calcSummary(arr) {
  itemsSold = arr.filter((item) => item.dateSold);
  totalItemsSold.textContent = `${itemsSold.length}/${arr.length}`;

  const allPrices = itemsSold.map((item) => item.priceSold);
  const totalIncomeCalc = allPrices.reduce((acc, item) => (acc += item), 0);
  totalIncome.textContent = `$${Math.floor(totalIncomeCalc)}`;
  

  currentBid.textContent = "N/D";

  if (currentAccount.some((item) => item.isAuctioning)) {
    biddingAmount
      ? (currentBid.textContent = `$${biddingAmount}`)
      : "No bids yet";
  }
}

function generateDates(start, daysAgo) {
  let arr = [];

  for (let i = 0; i < daysAgo; i++) {
    const startDate = new Date(start);
    const currentDate = startDate.setDate(new Date(start).getDate() - i);
    const formattedDate = formatDateChart(currentDate);
    arr.push(formattedDate);
  }

  return arr;
}

function formatDateChart(date) {
  return new Date(date).toLocaleDateString("en-GB");
}

const dateLabels = generateDates(new Date(), 7);
console.table(dateLabels);

function renderChart() {
  if (myChart) {
    myChart.destroy();
    chartBtns.forEach((btn) => {
      btn.classList.remove("income-chart__btn--active");
    });
    chartBtns[0].classList.add("income-chart__btn--active");
  }
  const newData = dateLabels.map((label) => {
    let sum = 0;
    itemsSold.forEach((item) => {
      
      if (formatDateChart(item.dateSold) === label) {
        sum += item.priceSold;
      }
    });
    return sum;
  });

  const data = {
    labels: dateLabels,
    datasets: [
      {
        label: "Amount",
        backgroundColor: "rgb(161, 106, 94)",
        borderColor: "rgb(161, 106, 94)",
        data: newData,
        barThickness: 10,
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          grid: {
            display: false
          }
        }
      },
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  myChart = new Chart(canvas, config);
}

chartBtns.forEach((chartBtn) => {
  chartBtn.addEventListener("click", (e) => {
    chartBtns.forEach((btn) => {
      btn.classList.remove("income-chart__btn--active");
    });
    e.target.classList.add("income-chart__btn--active");
  });
});

function getChartData(labels) {
  return labels.map((label) => {
    let sum = 0;
    itemsSold.forEach((item) => {
    
      if (formatDateChart(item.dateSold) === label) {
        sum += item.priceSold;
      }
    });
    return sum;
  });
}

summaryContainer.addEventListener("click", () => {
  window.location.hash = "auction";
});

// functions

function showLast7Days() {
  
  myChart.data.datasets[0].barThickness = 10;
  const newLabels = generateDates(new Date(), 7);
  myChart.data.labels = newLabels;
  const newData = getChartData(newLabels);
  myChart.data.datasets[0].data = newData;
  myChart.update();
  setHeightToChartContainer()
}

function showLast14Days() {
  const newLabels = generateDates(new Date(), 14);
  myChart.data.labels = newLabels;

  const newData = getChartData(newLabels);

  myChart.data.datasets[0].data = newData;
  myChart.update();
  setHeightToChartContainer()
}

function showLastMonth() {
  const newLabels = generateDates(new Date(), 30);
  myChart.data.labels = newLabels;
  myChart.data.datasets[0].barThickness = 2;
  const newData = getChartData(newLabels);
  myChart.data.datasets[0].data = newData;
  myChart.update();
  chartContainer.style.height = '80vh'
}

function showLastYear() {
 
  arr = [];
  for (let i = 0; i < 12; i++) {
    const startDate = new Date();
    const currentDate = startDate.setMonth(startDate.getMonth() - i);
    const month = `${new Date(currentDate).getMonth() + 1}`.padStart(2, 0);
    const year = new Date(currentDate).getFullYear();
    // const formattedDate = formatDateChart(currentDate);
    arr.push(`${month}/${year}`);
  }
  myChart.data.labels = arr;

  const newData = arr.map((label) => {
    let sum = 0;
    itemsSold.forEach((item) => {
      
      if (formatDateChart(item.dateSold).slice(3) === label) {
        sum += item.priceSold;
      }
    });
    return sum;
  });
  myChart.data.datasets[0].data = newData;

  myChart.update();
  setHeightToChartContainer()
}

function setHeightToChartContainer() {
  chartContainer.style.height = '60vh'
}