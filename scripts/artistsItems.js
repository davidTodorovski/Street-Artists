const artistItems = document.querySelector("#artistsItems");
const itemsContainer = document.querySelector(".item-container");
const addItem = document.querySelector(".add-new-item > div");
const addItemNav = document.querySelector(".add-item");
const addItemBtn = document.querySelector(".add-item__btn");
const cancelBtn = document.querySelector(".add-item__cancel-btn");
const isPublishedI = document.querySelector("#isPublished");
const itemTitle = document.querySelector("#itemTitle");
const itemDescription = document.querySelector("#itemDescription");
const itemType = document.querySelector("#itemType");
const itemPrice = document.querySelector("#itemPrice");
const itemImage = document.querySelector("#itemImage");
const snapshot = document.querySelector(".add-item__snapshot");
const cameraOutput = document.querySelector(".camera-output");

let allAccItems;
let editingIdx;

function initArtistsItems() {
  headingArtist.textContent = currentArtist.name;
  allAccItems = items.filter((item) => item.artist === currentArtist.name);

  itemsContainer.innerHTML = "";
  renderItems(allAccItems);

  itemType.innerHTML = '<option value="">Choose</option>';
  itemTypes.forEach((type) => {
    itemType.innerHTML += `
    '<option value="${type}">${type}</option>'
    `;
  });

  if (imageData) {
    cameraOutput.style.display = "block";
    snapshot.style.display = "none";
    cameraOutput.src = imageData;
    itemImage.value = imageData;
  }

  // Remove events
  snapshot.removeEventListener("click", goToCaptureImage);
  cameraOutput.removeEventListener("click", goToCaptureImage);

  // Events
  snapshot.addEventListener("click", goToCaptureImage);
  cameraOutput.addEventListener("click", goToCaptureImage);
}

function renderItems(arr) {
  function checkForAuctioningItem() {
    return items.every((item) => item.isAuctioning === false);
  }

  itemsContainer.innerHTML = "";
  arr.forEach((element) => {
    const { title, dateCreated, description, image, price, type } = element;

    const div1 = document.createElement("div");
    div1.classList.add("item");
    const div2 = document.createElement("div");
    const div3 = document.createElement("div");
    const div4 = document.createElement("div");
    const div5 = document.createElement("div");
    const div6 = document.createElement("div");
    const div7 = document.createElement("div");
    const div8 = document.createElement("div");
    div6.classList.add("item__buttons");
    div7.classList.add("item__details");
    div8.classList.add("item__picture-container");

    const p1 = document.createElement("p");
    p1.classList.add("item__title");
    p1.textContent = title;
    const p2 = document.createElement("p");
    p2.classList.add("item__date");
    p2.textContent = formatDate(new Date(dateCreated));
    const p3 = document.createElement("p");
    p3.classList.add("item__price");
    p3.textContent = `$${price}`;
    const p4 = document.createElement("p");
    p4.textContent = description;
    const sendToAuction = document.createElement("button");
    const publish = document.createElement("button");
    const remove = document.createElement("button");
    const edit = document.createElement("button");
    sendToAuction.classList.add("btn", "item__send-to-auction");
    if (checkForAuctioningItem()) {
      sendToAuction.disabled = false;
    } else {
      sendToAuction.disabled = true;
    }

    publish.classList.add(
      "btn",
      `${element.isPublished ? "item__publish" : "item__unpublish"}`
    );
    remove.classList.add("btn", "item__remove");
    edit.classList.add("btn", "item__edit");
    sendToAuction.textContent = "Send to auction";
    publish.textContent = element.isPublished ? "Unpublish" : "Publish";

    remove.textContent = "Remove";
    edit.textContent = "Edit";

    const img = document.createElement("img");
    img.classList.add("item__picture");
    img.src = image;

    div1.appendChild(div2);
    div8.append(img);
    div2.append(div8, div7, div6);
    div6.append(sendToAuction, publish, remove, edit);
    div7.append(div3, div5);
    div3.append(div4, p3);
    div4.append(p1, p2);
    div5.appendChild(p4);
    itemsContainer.appendChild(div1);

    // Remove item
    remove.addEventListener("click", () => {
      const confirm = window.confirm(
        "Are you sure you want to remove this item?"
      );
      if (!confirm) return;
      const i = items.indexOf(element);
      items.splice(i, 1);

      allAccItems = items.filter((item) => item.artist === currentArtist.name);

      renderItems(allAccItems);

      localStorage.setItem("items", JSON.stringify(items));
    });

    // Publish
    publish.addEventListener("click", (e) => {
      if (element.isPublished) {
        element.isPublished = false;
        e.target.classList.remove("item__publish");
        e.target.classList.add("item__unpublish");
        e.target.textContent = "Publish";
      } else if (!element.isPublished) {
        element.isPublished = true;
        e.target.classList.remove("item__unpublish");
        e.target.classList.add("item__publish");
        e.target.textContent = "Unpublish";
      }
      localStorage.setItem("items", JSON.stringify(items));
    });

    // Edit item
    edit.addEventListener("click", () => {
      addItemNav.classList.add("visible");
      addItemBtn.textContent = "Update";
      editingIdx = items.indexOf(element);

      isPublishedI.checked = element.isPublished;
      itemTitle.value = title;
      itemDescription.value = description;
      itemType.value = type;
      itemPrice.value = price;
      itemImage.value = image;
    });

    // Send to auction
    sendToAuction.addEventListener("click", () => {
      console.log(10);
      element.isAuctioning = true;
      localStorage.setItem("items", JSON.stringify(items));
      renderItems(allAccItems);
      if (timer) clearInterval(timer);
      timer = startAuctionTimer();
      bidState = true;
      localStorage.setItem("bidState", bidState);
    });
  });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB");
}

function validInputs(...inputs) {
  return inputs.every((input) => input !== "");
}

function removeItem(obj) {
  console.log(obj);
}

addItem.addEventListener("click", () => {
  addItemNav.classList.add("visible");
  editingIdx = undefined;
});

function clearInputs() {
  itemTitle.value =
    itemDescription.value =
    itemType.value =
    itemPrice.value =
    itemImage.value =
      "";
  isPublishedI.checked = false;
}

// Add/Update item
addItemBtn.addEventListener("click", (e) => {
  const isPublishedValue = isPublishedI.checked;
  const titleValue = itemTitle.value;
  const descriptionValue = itemDescription.value;
  const typeValue = itemType.value;
  const priceValue = itemPrice.value;
  const imgValue = itemImage.value;

  if (
    validInputs(titleValue, descriptionValue, typeValue, priceValue, imgValue)
  ) {
    const obj = {
      id: (Date.now() + "").slice(-10),
      title: titleValue,
      description: descriptionValue,
      type: typeValue,
      image: imgValue,
      price: priceValue,
      artist: currentArtist.name,
      dateCreated: new Date().toISOString(),
      isPublished: isPublishedValue,
      isAuctioning: false,
      dateSold: "",
      priceSold: "",
    };

    if (typeof editingIdx !== "undefined") {
      items[editingIdx].title = titleValue;
      items[editingIdx].description = descriptionValue;
      items[editingIdx].type = typeValue;
      items[editingIdx].price = +priceValue;
      items[editingIdx].image = imgValue;
      items[editingIdx].isPublished = isPublishedValue;
      editingIdx = undefined;
      e.target.textContent = "Add new Item";
    } else {
      items.push(obj);
      imageData = undefined;
      setDisplayToCaptureImageAndSnapshot();
    }

    allAccItems = items.filter((item) => item.artist === currentArtist.name);
    renderItems(allAccItems);

    localStorage.setItem("items", JSON.stringify(items));
    clearInputs();
    addItemNav.classList.remove("visible");
  }
});

cancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  clearInputs();
  addItemNav.classList.remove("visible");
  addItemBtn.textContent = "Add new Item";
  editingIdx = undefined;
  imageData = undefined;
  setDisplayToCaptureImageAndSnapshot();
});

function goToCaptureImage() {
  window.location.hash = "captureImage";
}

function setDisplayToCaptureImageAndSnapshot() {
  cameraOutput.style.display = "none";
  snapshot.style.display = "flex";
}
