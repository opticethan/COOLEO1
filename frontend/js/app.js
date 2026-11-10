const productGrid = document.getElementById("productGrid");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const toast = document.getElementById("toast");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// No sample products are displayed.
// Real listings will be loaded from the backend.
function renderMarketplace() {
  if (productGrid) {
    productGrid.innerHTML = "";
    productGrid.hidden = true;
  }

  if (resultCount) {
    resultCount.textContent = "Waiting for marketplace listings";
  }

  if (emptyState) {
    emptyState.hidden = false;
  }
}

const searchForm = document.getElementById("searchForm");

if (searchForm) {
  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    showToast("Product search will be connected to the marketplace.");
    document.getElementById("discover")?.scrollIntoView({
      behavior: "smooth"
    });
  });
}

if (searchInput) {
  searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchForm?.requestSubmit();
    }
  });
}

if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    showToast("Sorting will be available when listings are connected.");
  });
}

const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
    menuToggle.textContent =
      mobileNav.classList.contains("open") ? "✕" : "☰";
  });

  mobileNav.addEventListener("click", event => {
    if (event.target.closest("a")) {
      mobileNav.classList.remove("open");
      menuToggle.textContent = "☰";
    }
  });
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

renderMarketplace();
