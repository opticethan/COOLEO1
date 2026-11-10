"use strict";

const searchForm = document.getElementById("productsSearchForm");
const searchInput = document.getElementById("productsSearch");
const categoryFilter = document.getElementById("categoryFilter");
const sortProducts = document.getElementById("sortProducts");
const resultCount = document.getElementById("productsResultCount");
const emptyState = document.getElementById("productsEmptyState");
const toast = document.getElementById("productsToast");
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");

let toastTimer;

function showProductsToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Keep the page honest until real marketplace data is connected.
function renderProducts() {
  if (resultCount) {
    resultCount.textContent = "No published products available yet";
  }

  if (emptyState) {
    emptyState.hidden = false;
  }
}

if (searchForm) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();

    if (!query) {
      showProductsToast("Enter a product name to search.");
      searchInput.focus();
      return;
    }

    const params = new URLSearchParams(window.location.search);
    params.set("q", query);

    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );

    showProductsToast("Product search will be available when listings are connected.");
  });
}

if (categoryFilter) {
  categoryFilter.addEventListener("change", () => {
    showProductsToast("Category filtering will be available when marketplace data is connected.");
  });
}

if (sortProducts) {
  sortProducts.addEventListener("change", () => {
    showProductsToast("Product sorting will be available when listings are connected.");
  });
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");

    menuToggle.textContent = isOpen ? "✕" : "☰";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    });
  });
}

const initialQuery = new URLSearchParams(window.location.search).get("q");

if (initialQuery && searchInput) {
  searchInput.value = initialQuery;
}

const year = document.getElementById("productsYear");

if (year) {
  year.textContent = new Date().getFullYear();
}

renderProducts();
