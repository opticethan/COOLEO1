const products = [
  {
    id: 1,
    name: "Samsung Galaxy Smartphone",
    category: "Phones",
    price: 350000,
    condition: "Pre-loved",
    location: "Blantyre",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=85",
    created: 8
  },
  {
    id: 2,
    name: "HP Everyday Laptop",
    category: "Electronics",
    price: 550000,
    condition: "Pre-loved",
    location: "Lilongwe",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85",
    created: 7
  },
  {
    id: 3,
    name: "Classic White Sneakers",
    category: "Fashion",
    price: 65000,
    condition: "New",
    location: "Zomba",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85",
    created: 6
  },
  {
    id: 4,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 45000,
    condition: "New",
    location: "Blantyre",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85",
    created: 5
  },
  {
    id: 5,
    name: "Comfortable Living Room Sofa",
    category: "Furniture",
    price: 280000,
    condition: "Pre-loved",
    location: "Lilongwe",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=85",
    created: 4
  },
  {
    id: 6,
    name: "Minimal Wrist Watch",
    category: "Fashion",
    price: 38000,
    condition: "New",
    location: "Mzuzu",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85",
    created: 3
  },
  {
    id: 7,
    name: "Digital Camera",
    category: "Electronics",
    price: 220000,
    condition: "Pre-loved",
    location: "Blantyre",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=85",
    created: 2
  },
  {
    id: 8,
    name: "Everyday Backpack",
    category: "Fashion",
    price: 32000,
    condition: "New",
    location: "Zomba",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85",
    created: 1
  }
];

const productGrid = document.getElementById("productGrid");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");

let activeCategory = "All";
let searchTerm = "";
let cartItems = 0;
const favourites = new Set();

function formatPrice(price) {
  return "MK " + new Intl.NumberFormat("en-US").format(price);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2300);
}

function getVisibleProducts() {
  let visible = products.filter(product => {
    const categoryMatch = activeCategory === "All" || product.category === activeCategory;
    const searchMatch = `${product.name} ${product.category} ${product.location}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const sortMode = sortSelect.value;
  if (sortMode === "low") visible.sort((a, b) => a.price - b.price);
  if (sortMode === "high") visible.sort((a, b) => b.price - a.price);
  if (sortMode === "newest") visible.sort((a, b) => a.created - b.created);

  return visible;
}

function renderProducts() {
  const visible = getVisibleProducts();

  productGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-photo">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-tag">${product.condition}</span>
        <button
          class="favourite-button ${favourites.has(product.id) ? "is-favourite" : ""}"
          data-favourite="${product.id}"
          aria-label="Add ${product.name} to favourites"
          aria-pressed="${favourites.has(product.id)}"
        >${favourites.has(product.id) ? "♥" : "♡"}</button>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-meta">
          <span class="product-price">${formatPrice(product.price)}</span>
          <span>${product.condition}</span>
        </div>
        <div class="product-location">⌖ ${product.location}, Malawi</div>
        <div class="product-bottom">
          <span class="product-category">MARKETPLACE FIND</span>
          <button class="add-button" data-add="${product.id}">Add to bag +</button>
        </div>
      </div>
    </article>
  `).join("");

  resultCount.textContent = `${visible.length} ${visible.length === 1 ? "find" : "finds"} to explore`;
  emptyState.hidden = visible.length !== 0;
  productGrid.hidden = visible.length === 0;
}

document.getElementById("categoryList").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;
  document.querySelectorAll(".category-chip").forEach(chip => {
    chip.classList.toggle("active", chip === button);
  });
  renderProducts();
});

document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  searchTerm = searchInput.value.trim();
  renderProducts();
  document.getElementById("discover").scrollIntoView({ behavior: "smooth" });
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim();
  renderProducts();
});

sortSelect.addEventListener("change", renderProducts);

productGrid.addEventListener("click", event => {
  const favouriteButton = event.target.closest("[data-favourite]");
  const addButton = event.target.closest("[data-add]");

  if (favouriteButton) {
    const id = Number(favouriteButton.dataset.favourite);
    if (favourites.has(id)) {
      favourites.delete(id);
      showToast("Removed from your favourites");
    } else {
      favourites.add(id);
      showToast("Added to your favourites");
    }
    renderProducts();
  }

  if (addButton) {
    cartItems += 1;
    cartCount.textContent = cartItems;
    showToast("Added to your bag — demo only");
  }
});

document.getElementById("clearFilters").addEventListener("click", () => {
  activeCategory = "All";
  searchTerm = "";
  searchInput.value = "";
  document.querySelectorAll(".category-chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.category === "All");
  });
  renderProducts();
});

document.getElementById("cartButton").addEventListener("click", () => {
  showToast(cartItems ? `${cartItems} item(s) in your demo bag` : "Your bag is empty for now");
});

const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");

menuToggle.addEventListener("click", () => {
  mobileNav.classList.toggle("open");
  menuToggle.textContent = mobileNav.classList.contains("open") ? "✕" : "☰";
});

mobileNav.addEventListener("click", event => {
  if (event.target.closest("a")) {
    mobileNav.classList.remove("open");
    menuToggle.textContent = "☰";
  }
});

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
