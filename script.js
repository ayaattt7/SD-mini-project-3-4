// ================== 1. Variables ==================

// API-r link. limit=40 mane 40 ta product ashbe. Kono API key lagbe na.
const API_URL = "https://dummyjson.com/products?limit=40";

// HTML theke element gulo dhorlam (querySelector diye, id er jonno # dite hoy)
const productList = document.querySelector("#productList");       // card gulo ekhane boshbe
const searchInput = document.querySelector("#searchInput");       // search box
const categorySelect = document.querySelector("#categorySelect"); // category dropdown
const sortSelect = document.querySelector("#sortSelect");         // sort dropdown
const favOnlyBtn = document.querySelector("#favOnlyBtn");         // "Show saved only" button
const statusMsg = document.querySelector("#statusMsg");           // loading/error/empty message
const retryBtn = document.querySelector("#retryBtn");             // "Try again" button
const favCount = document.querySelector("#favCount");            // "Saved: 0" text

// Modal (details popup) er element gulo
const modal = document.querySelector("#modal");
const closeModal = document.querySelector("#closeModal");
const modalImg = document.querySelector("#modalImg");
const modalTitle = document.querySelector("#modalTitle");
const modalCategory = document.querySelector("#modalCategory");
const modalDesc = document.querySelector("#modalDesc");
const modalPrice = document.querySelector("#modalPrice");
const modalRating = document.querySelector("#modalRating");
const modalStock = document.querySelector("#modalStock");

let allProducts = [];                 // API theke asha shob product ekhane thakbe
let favorites = loadFavorites();      // saved product er id gulo (localStorage theke ashe)
let showFavOnly = false;              // true hole shudhu saved product dekhabe


// ================== 2. Local Storage ==================

// localStorage theke favorites ber kore ane
function loadFavorites() {
  const saved = localStorage.getItem("favorites"); // "favorites" key te ja save kora ache ta nilam
  if (saved) {                                      // jodi kichu save kora thake
    return JSON.parse(saved);                       // text ke abar array banalam
  }
  return [];                                        // kichu na thakle faka array
}

// favorites array ke localStorage e save kore
function saveFavorites() {
  // localStorage e shudhu text thake, tai array ke JSON text banalam
  localStorage.setItem("favorites", JSON.stringify(favorites));
}


// ================== 3. API theke data ana (fetch + async/await) ==================

async function fetchProducts() {
  showMessage("Loading products...");  // loading state
  retryBtn.hidden = true;              // retry button lukalam
  productList.innerHTML = "";          // ager card gulo muche dilam

  try {                                                   // try te kaj korbo, error hole catch e jabe
    const response = await fetch(API_URL);                // API te request pathalam, uttor er jonno wait korlam
    if (!response.ok) {                                   // server jodi error dey (404, 500 etc.)
      throw new Error("Server error " + response.status); // nijeri error toiri kore catch e pathalam
    }
    const data = await response.json();                   // uttor ke JavaScript object banalam
    allProducts = data.products;                          // products array ta save korlam
    fillCategories();                                     // dropdown e category gulo boshalam
    showProducts();                                       // card gulo dekhalam
  } catch (error) {                                       // internet na thakle ba error hole
    showMessage("Could not load products. " + error.message); // error state
    retryBtn.hidden = false;                              // "Try again" button dekhalam
  }
}


// ================== 4. Dropdown e category boshano ==================

function fillCategories() {
  const categories = [];                                // unique category rakhar array

  allProducts.forEach((product) => {                    // protita product er jonno
    if (!categories.includes(product.category)) {       // category ta ager theke na thakle
      categories.push(product.category);                // array te joma dilam
    }
  });

  categories.forEach((cat) => {                         // protita category er jonno
    const option = document.createElement("option");    // notun <option> toiri
    option.value = cat;                                 // value = original category name
    option.textContent = cat.replace(/-/g, " ");        // dekhanor jonno "-" muche space dilam
    categorySelect.appendChild(option);                 // dropdown e joma dilam
  });
}


// ================== 5. Filter, search, sort ==================

// Ekhon kon kon product dekhabo ta ber kore (search + category + saved + sort)
function getVisibleProducts() {
  let list = allProducts.slice();                       // copy nilam, jate original array na bodlay

  const text = searchInput.value.trim().toLowerCase();  // search box er lekha, choto hater
  if (text !== "") {                                    // kichu lekha thakle
    list = list.filter((product) => product.title.toLowerCase().includes(text)); // naam er moddhe match
  }

  if (categorySelect.value !== "all") {                 // specific category select kora thakle
    list = list.filter((product) => product.category === categorySelect.value);
  }

  if (showFavOnly) {                                    // "saved only" on thakle
    list = list.filter((product) => favorites.includes(product.id));
  }

  if (sortSelect.value === "low") {                     // dam kom theke beshi
    list.sort((a, b) => a.price - b.price);
  } else if (sortSelect.value === "high") {             // dam beshi theke kom
    list.sort((a, b) => b.price - a.price);
  }

  return list;                                          // final list ferot dilam
}


// ================== 6. Screen e card dekhano (DOM) ==================

function showProducts() {
  const list = getVisibleProducts();                    // dekhanor product gulo nilam
  updateFavCount();                                     // "Saved: N" update
  productList.innerHTML = "";                           // ager card muche dilam

  if (list.length === 0) {                              // empty state
    if (showFavOnly && favorites.length === 0) {
      showMessage("No saved products yet. Tap Save on a product to keep it here.");
    } else {
      showMessage("No products found. Try a different search or category.");
    }
    return;                                             // r kichu korar nai, function shesh
  }

  showMessage("Showing " + list.length + " products");  // koyta product dekhachi
  list.forEach((product) => {                           // protita product er jonno
    const card = createCard(product);                   // card banalam
    productList.appendChild(card);                      // grid e boshalam
  });
}

// Ekta product er jonno ekta card toiri kore
function createCard(product) {
  const card = document.createElement("article");       // card er baire er box
  card.className = "card";                              // CSS class

  const img = document.createElement("img");            // chobi
  img.src = product.thumbnail;                          // API er chobir link
  img.alt = product.title;                              // alt text
  img.loading = "lazy";                                 // dorkar hole load hobe

  const body = document.createElement("div");           // card er lekha-r jaygar box
  body.className = "card-body";

  const title = document.createElement("h3");           // product er naam
  title.textContent = product.title;

  const category = document.createElement("p");         // category
  category.className = "category";
  category.textContent = product.category.replace(/-/g, " ");

  const price = document.createElement("p");            // dam
  price.className = "price";
  price.textContent = "$" + product.price;

  const buttons = document.createElement("div");        // duita button er box
  buttons.className = "card-buttons";

  const detailsBtn = document.createElement("button");  // Details button
  detailsBtn.textContent = "Details";
  detailsBtn.addEventListener("click", () => {          // click korle
    openModal(product.id);                              // popup khulbe
  });

  const favBtn = document.createElement("button");      // Save button
  favBtn.className = "fav-btn";
  if (favorites.includes(product.id)) {                 // ager theke saved hole
    favBtn.textContent = "♥ Saved";
    favBtn.classList.add("active");                     // lal color
  } else {
    favBtn.textContent = "♡ Save";
  }
  favBtn.addEventListener("click", () => {              // click korle
    toggleFavorite(product.id);                         // save/unsave hobe
  });

  buttons.appendChild(detailsBtn);                      // button duto box e rakhlam
  buttons.appendChild(favBtn);

  body.appendChild(title);                              // lekha gulo body te rakhlam
  body.appendChild(category);
  body.appendChild(price);
  body.appendChild(buttons);

  card.appendChild(img);                                // chobi + body card e rakhlam
  card.appendChild(body);

  return card;                                          // ready card ferot dilam
}

// Message dekhay (loading, error, empty, count)
function showMessage(text) {
  statusMsg.textContent = text;
}

// "Saved: N" update kore
function updateFavCount() {
  favCount.textContent = "Saved: " + favorites.length;
}


// ================== 7. Save / Unsave ==================

function toggleFavorite(id) {
  if (favorites.includes(id)) {                         // ager theke saved thakle
    favorites = favorites.filter((favId) => favId !== id); // oi id bade baki gulo rakhlam (unsave)
  } else {
    favorites.push(id);                                 // na thakle add korlam (save)
  }
  saveFavorites();                                      // localStorage e save
  showProducts();                                       // screen abar draw
}


// ================== 8. Details popup ==================

function openModal(id) {
  const product = allProducts.find((p) => p.id === id); // id diye product khuje ber korlam

  modalImg.src = product.thumbnail;                     // popup er moddhe data boshalam
  modalImg.alt = product.title;
  modalTitle.textContent = product.title;
  modalCategory.textContent = product.category.replace(/-/g, " ");
  modalDesc.textContent = product.description;
  modalPrice.textContent = "$" + product.price;
  modalRating.textContent = "Rating: " + product.rating + " / 5";
  modalStock.textContent = "In stock: " + product.stock;

  modal.classList.remove("hidden");                     // popup dekhalam
}

function hideModal() {
  modal.classList.add("hidden");                        // popup lukalam
}


// ================== 9. Event listeners ==================

searchInput.addEventListener("input", showProducts);       // lekhar shathe shathe filter
categorySelect.addEventListener("change", showProducts);   // category bodlale filter
sortSelect.addEventListener("change", showProducts);       // sort bodlale abar sajano

favOnlyBtn.addEventListener("click", () => {               // "Show saved only" click
  showFavOnly = !showFavOnly;                              // true <-> false
  favOnlyBtn.classList.toggle("active", showFavOnly);      // on thakle lal color
  favOnlyBtn.textContent = showFavOnly ? "Show all products" : "Show saved only";
  showProducts();                                          // list update
});

retryBtn.addEventListener("click", fetchProducts);         // error hole abar try

closeModal.addEventListener("click", hideModal);           // X button e popup bondho

modal.addEventListener("click", (event) => {               // popup er baire (dark jaygay) click
  if (event.target === modal) {                            // jodi thik dark jaygay click hoy
    hideModal();
  }
});

document.addEventListener("keydown", (event) => {          // keyboard e
  if (event.key === "Escape") {                            // Esc chaple
    hideModal();                                           // popup bondho
  }
});


// ================== 10. Start ==================

updateFavCount();   // page khulei saved count dekhao (refresh er por-o thakbe)
fetchProducts();    // API theke data niye ashar kaj shuru
