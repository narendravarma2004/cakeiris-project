const menuBtn = document.getElementById('menu-btn');
const navbar = document.getElementById('navbar');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartClose = document.getElementById('cart-close');
const cartBackdrop = document.getElementById('cart-backdrop');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');
const buyBtn = document.getElementById('buy-btn');
const themeToggle = document.getElementById('theme-toggle');
const logoutBtn = document.getElementById('logout-btn');

// --- Theme Toggle ---
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
  const isLight = document.documentElement.classList.contains('light');
  themeToggle.querySelector('i').classList.toggle('fa-moon', !isLight);
  themeToggle.querySelector('i').classList.toggle('fa-sun', isLight);
});

// --- Nav Toggle ---
menuBtn.addEventListener('click', () => {
  navbar.classList.toggle('show');
});
window.addEventListener('scroll', () => navbar.classList.remove('show'));

// --- Logout ---
function goHome() {
  window.location.href = 'index.html';
}
logoutBtn.addEventListener('click', goHome);

// --- Browser Back Navigation ---
try {
  history.pushState(null, '', location.href);
  window.addEventListener('popstate', () => {
    window.location.href = 'index.html';
  });
} catch (_) {
  // Ignore if not supported
}

// --- Slider ---
const slides = document.querySelectorAll('.slides-container .slide');
let current = 0;

function showSlide(i) {
  slides[current].classList.remove('active');
  current = (i + slides.length) % slides.length;
  slides[current].classList.add('active');
}

document.getElementById('next-slide').addEventListener('click', () => showSlide(current + 1));
document.getElementById('prev-slide').addEventListener('click', () => showSlide(current - 1));

// Auto-rotate
let autoRotate = setInterval(() => showSlide(current + 1), 5000);
['next-slide', 'prev-slide'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => {
    clearInterval(autoRotate);
    autoRotate = setInterval(() => showSlide(current + 1), 5000);
  });
});

// --- Cart Management ---
function getCart() {
  try {
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
  const cart = getCart();
  cartItemsEl.innerHTML = '';
  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <img src="${item.img || 'placeholder.jpg'}" alt="${item.name || 'Item'}" />
      <div>
        <div class="item-title">${item.name || 'Item'}</div>
        <div class="item-meta">₹${Number(item.price || 0).toFixed(2)} × ${item.quantity || 1}</div>
      </div>
      <div class="item-actions">
        <div class="small-row">
          <button class="small-btn" data-action="decrease" data-index="${index}">-</button>
          <span>${item.quantity || 1}</span>
          <button class="small-btn" data-action="increase" data-index="${index}">+</button>
        </div>
        <button class="del-btn" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    cartItemsEl.appendChild(li);
    total += (item.price || 0) * (item.quantity || 1);
    count += (item.quantity || 1);
  });

  cartTotalEl.textContent = total.toFixed(2);
  cartCountEl.textContent = count;
}

// Cart quantity controls
cartItemsEl.addEventListener('click', (e) => {
  const cart = getCart();
  const index = e.target.dataset.index;
  if (!index) return;

  if (e.target.dataset.action === 'increase') {
    cart[index].quantity = (cart[index].quantity || 1) + 1;
  } else if (e.target.dataset.action === 'decrease') {
    cart[index].quantity = Math.max(1, (cart[index].quantity || 1) - 1);
  } else if (e.target.classList.contains('del-btn') || e.target.closest('.del-btn')) {
    cart.splice(index, 1);
  }

  setCart(cart);
  renderCart();
});

// Open/Close cart
function openCart() {
  renderCart();
  cartModal.classList.add('show');
  cartModal.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  cartModal.classList.remove('show');
  cartModal.setAttribute('aria-hidden', 'true');
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartBackdrop.addEventListener('click', closeCart);

// Checkout
function proceedToBuy() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const name = document.getElementById('customer-name').value.trim();
  const email = document.getElementById('customer-email').value.trim();
  const address = document.getElementById('customer-address').value.trim();
  const mobile = document.getElementById('customer-mobile').value.trim();

  if (!name || !email || !address || !mobile) {
    alert('Please fill in all checkout details.');
    return;
  }

  if (!/^[0-9]{10}$/.test(mobile)) {
    alert('Please enter a valid 10-digit mobile number.');
    return;
  }

  alert('Order placed successfully! Thank you for shopping with CAKEIRIS.');
  setCart([]);
  renderCart();
  closeCart();
  document.getElementById('customer-name').value = '';
  document.getElementById('customer-email').value = '';
  document.getElementById('customer-address').value = '';
  document.getElementById('customer-mobile').value = '';
}

buyBtn.addEventListener('click', proceedToBuy);

// Initial cart render
renderCart();

// Reflect cart updates from other pages
window.addEventListener('storage', (e) => {
  if (e.key === 'cart') renderCart();
});