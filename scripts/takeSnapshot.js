let imageData;
let allVideoDevices;
let video;
let camera;
let capturePhoto;
let canvasI;
let image;
let width = 340;
let height = 600;

function initTakeSnapshot() {

  function initCamera() {
    video = document.querySelector("#video");
    camera = document.querySelector("#camera-output__image");
    capturePhoto = document.querySelector("#capture-photo");
    canvasI = document.querySelector("#canvas");
    // image = document.querySelector("#camera-output__image");
    const constrains = {
      audio: false,
      video: {
        facingMode: { ideal: "environment" },
      },
    };
    navigator.mediaDevices.getUserMedia(constrains).then((stream) => {
      video.srcObject = stream;
    });

    // Remove Events
    video.removeEventListener("canplay", canPlay);
    video.addEventListener("canplay", canPlay);

    // Events
    capturePhoto.removeEventListener("click", captureImage);
    capturePhoto.addEventListener("click", captureImage);
  }

  initCamera();
}

function captureImage() {
  const context = canvasI.getContext("2d");

  context.drawImage(video, 0, 0, width, height);

  imageData = canvasI.toDataURL("image/png");

  setTimeout(() => {
    window.location.hash = "artists/items";
  }, 2000);
}

function canPlay() {
  height = video.videoHeight;
  width = video.videoWidth;
  video.setAttribute("width", 340);
  video.setAttribute("height", 600);
  canvasI.setAttribute("width", 340);
  canvasI.setAttribute("height", 600);
}
