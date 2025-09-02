let cart = [];

function addToCart(name, price, img) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, quantity: 1, img });
  }
  updateCartDisplay();
  showToast();
}

function updateCartDisplay() {
  const cartItemsElement = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  const cartCountElement = document.getElementById('cart-count');
  cartItemsElement.innerHTML = '';
  let total = 0;
  let itemCount = 0;

  cart.forEach(product => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <div>
        <div class="item-title">${product.name}</div>
        <div class="item-meta">₹${product.price} × ${product.quantity}</div>
      </div>
      <div class="item-actions">
        <div class="small-row">
          <button class="small-btn" onclick="decreaseQuantity('${product.name}')">-</button>
          <span>${product.quantity}</span>
          <button class="small-btn" onclick="increaseQuantity('${product.name}')">+</button>
        </div>
        <button class="del-btn" onclick="removeFromCart('${product.name}')">Remove</button>
      </div>
    `;
    cartItemsElement.appendChild(li);
    total += product.price * product.quantity;
    itemCount += product.quantity;
  });

  cartTotalElement.textContent = total.toFixed(2);
  cartCountElement.textContent = itemCount;
}

function increaseQuantity(name) {
  const item = cart.find(product => product.name === name);
  if (item) {
    item.quantity++;
    updateCartDisplay();
  }
}

function decreaseQuantity(name) {
  const item = cart.find(product => product.name === name);
  if (item && item.quantity > 1) {
    item.quantity--;
    updateCartDisplay();
  }
}

function removeFromCart(name) {
  cart = cart.filter(product => product.name !== name);
  updateCartDisplay();
}

async function proceedToBuy() {
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
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const refID = 'ORDER-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  let itemsList = '';
  cart.forEach(product => {
    itemsList += `- ${product.name} x ${product.quantity} = ₹${(product.price * product.quantity).toFixed(2)}\n`;
  });
  const paymentInstructions = 'Please pay the total amount to the following bank details:\nAccount Number: 123456789\nBank: Example Bank\nIFSC: EXMP0001\n\nAfter payment, please reply to this email with the payment proof to confirm your order.';
  const emailContent = {
    to: [email, 'rockstarking775@gmail.com'],
    subject: `Order Confirmation - ${refID}`,
    body: `Dear ${name},\n\nYour order has been placed successfully!\n\nOrder Reference ID: ${refID}\nCustomer Name: ${name}\nAddress: ${address}\nMobile Number: ${mobile}\n\nOrder Details:\n${itemsList}\nTotal Amount: ₹${total.toFixed(2)}\n\n${paymentInstructions}\n\nThank you for shopping with CAKEIRIS!\n\nFor any information regarding orders kindly contact admin shown in contact section `
  };

  try {
    const response = await fetch('/.netlify/functions/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(emailContent)
});
    if (response.ok) {
      alert(`Order placed! An email with Reference ID ${refID} has been sent to ${email} and rockstarking775@gmail.com. \n nFor any information regarding orders kindly contact admin shown in contact section`);
      cart = [];
      updateCartDisplay();
      closeCart();
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    alert(`Order placed, but email sending failed. Reference ID: ${refID}. Please contact support at rockstarking775@gmail.com.`);
    cart = [];
    updateCartDisplay();
    closeCart();
  }
}

function showCart() {
  document.getElementById('cart-modal').classList.add('show');
}

function closeCart() {
  document.getElementById('cart-modal').classList.remove('show');
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.className = 'toast show';
  setTimeout(() => {
    toast.className = toast.className.replace('show', '');
  }, 3000);
}

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', event => {
    const productBox = event.target.closest('.box');
    const productName = productBox.dataset.name;
    const productPrice = parseFloat(productBox.dataset.price);
    const productImg = productBox.dataset.img;
    addToCart(productName, productPrice, productImg);
  });
});

document.getElementById('theme-toggle').addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
});

document.getElementById('cart-modal').addEventListener('click', event => {
  if (event.target.classList.contains('backdrop')) {
    closeCart();
  }
});