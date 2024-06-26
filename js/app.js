// DOM Variables
const spinner = document.getElementById("spinner");
const products = document.getElementById("products");
const topScroll = document.getElementById("topScroll");
const modal = document.getElementById("modal");
const moreFood = document.getElementById("moreFood");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const showAlert = document.getElementById("alert");
// Variables
let allFoods = [];
let currentIndex = 0;
const initialShowCount = 12;
const loadMoreCount = 4;

// Event Listener
window.addEventListener("load", mainFunc);
window.addEventListener("scroll", scrolling);
topScroll.addEventListener("click", scrollToTop);
moreFood.addEventListener("click", showMoreFoods);
searchBtn.addEventListener("click", searchFood);
searchInput.addEventListener("change", resetFood);
// Main Functionality
async function mainFunc() {
  const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  spinner.classList.remove("d-none");
  moreFood.classList.add("d-none");
  showAlert.classList.add("d-none");
  const data = await getData(url);
  allFoods = data;
  showFoods(allFoods.slice(0, initialShowCount));
  currentIndex = initialShowCount;
  if (currentIndex >= allFoods.length) {
    moreFood.style.display = "none";
  }
}
// Get Data Form Api
async function getData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.meals;
  } catch (error) {
    return error;
  }
}
// Showing All Foods
function showFoods(foods) {
  let foodItems = "";
  foods.forEach((food) => {
    // Items Price Generate
    let price = food.idMeal.split("");
    let amount = 0;
    price.forEach((p) => {
      let priceNum = Number(p);
      amount += priceNum;
    });
    // Generate Food Items
    let item = `<div class="col-12 col-md-6 col-lg-4 col-xl-3">
           <div class="p-item rounded shadow text-center pb-1">
              <div class="img-box">
                <img src="${food.strMealThumb}" class="img-fluid" alt="" />
              </div>
              <div class="product-content mt-4">
                <h2>${food.strMeal}</h2>
                <p class="p-2">
                  ${food.strInstructions.slice(0, 100) + "..."}
                </p>
                <div
                  class="info-box d-flex justify-content-between align-items-center px-2"
                >
                  <p class="price">Prices: <span>${amount}$</span></p>
                  <button class="primary-btn" onClick="showModal(${
                    food.idMeal
                  }, ${amount})">More Info</button>
                </div>
              </div>
            </div>
            </div>`;
    foodItems += item;
  });
  if (foodItems) {
    spinner.classList.add("d-none");
    moreFood.classList.remove("d-none");
  }
  products.innerHTML += foodItems;
}
// Show More Foods
function showMoreFoods() {
  const nextFoods = allFoods.slice(currentIndex, currentIndex + loadMoreCount);
  showFoods(nextFoods);
  currentIndex += loadMoreCount;
  if (currentIndex >= allFoods.length) {
    moreFood.style.display = "none";
  }
}
// Search Food
async function searchFood(event) {
  event.preventDefault();
  let searchKeyword = searchInput.value;
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchKeyword}`;
  spinner.classList.remove("d-none");
  const foods = await getData(url);
  try {
    products.innerHTML = "";
    moreFood.style.display = "none";
    showAlert.classList.add("d-none");
    showFoods(foods);
  } catch (error) {
    products.innerHTML = "";
    console.log(showAlert);
    showAlert.classList.remove("d-none");
  }
}
// Reset Food
function resetFood() {
  if (searchInput.value == "") {
    products.innerHTML = "";
    mainFunc();
  }
}
// Show Modal Data
async function showModal(id, price) {
  modal.innerHTML = "";
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  const data = await getData(url);
  console.log(data);
  const card = `
        <div class="card">
        <div class="card-img position-relative">
          <img src="${data[0].strMealThumb}" class="card-img-top" alt="..." />
          <div class="cross-btn d-inline-block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              id="cross"
              width="30"
              onClick="hideModal()"
            >
              <path
                fill="#ffffff"
                d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm3.21 11.79a1 1 0 0 1 0 1.42 1 1 0 0 1-1.42 0L12 13.41l-1.79 1.8a1 1 0 0 1-1.42 0 1 1 0 0 1 0-1.42l1.8-1.79-1.8-1.79a1 1 0 0 1 1.42-1.42l1.79 1.8 1.79-1.8a1 1 0 0 1 1.42 1.42L13.41 12Z"
                class="color464646 svgShape"
              ></path>
            </svg>
          </div>
        </div>
        <div class="card-body">
          <div
            class="product-info d-flex justify-content-between align-items-center border-bottom mb-2"
          >
            <p class="mb-1">Meal ID: ${data[0].idMeal}</p>
            <p class="mb-1">Category: ${data[0].strCategory}</p>
          </div>
          <h5 class="card-title">${data[0].strMeal}</h5>
          <p class="card-text">
            <span class="fw-bold">Des:</span> 
            ${data[0].strInstructions.slice(0, 300)}
          </p>
          <div
            class="info-box d-flex justify-content-between align-items-center px-2 border-top-0"
          >
            <p class="price mb-0">Price: <span>${price}$</span></p>
            <button href="#" class="primary-btn py-2 px-4">Buy Now</button>
          </div>
        </div>
      </div>
  `;
  modal.innerHTML = card;
  modal.style.visibility = "visible";
  modal.style.opacity = 1;
}
// Hidden Modal
function hideModal() {
  modal.style.visibility = "hidden";
  modal.style.opacity = 0;
}
// Scroll to Top Functionality
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrolling() {
  let px = window.pageYOffset;
  if (px > 200) {
    topScroll.style.opacity = 1;
    topScroll.style.visibility = "visible";
  } else {
    topScroll.style.opacity = 0;
    topScroll.style.visibility = "hidden";
  }
}
