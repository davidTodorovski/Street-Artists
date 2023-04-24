const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".carousel__btn--left");
const btnRight = document.querySelector(".carousel__btn--right");

let curSlide = 0;
const maxSlide = slides.length;
function initVisitorHomePage() {
  carousel();
}

function carousel() {
  goToSlide(curSlide);

  // Next slide

  btnRight.removeEventListener("click", nextSlide);
  btnLeft.removeEventListener("click", nextSlide);
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);
}

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
};
