const products = [
  {id:1, name:'Tomates bio', price:2.50, quantity:50, img:'tomate-bio.jpg'}, 
  {id:2, name:'Fraises fraîches', price:3.80, quantity:30, img:'fraise.jpg'},
  {id:3, name:'Lait frais', price:1.20, quantity:20, img:'lait.jpg'},
  {id:4, name:'Pain complet', price:2.00, quantity:15, img:'pain.jpg'},
  {id:5, name:'Pommes', price:2.30, quantity:40, img:'pommes.jpg'},
  {id:6, name:'Carottes', price:1.50, quantity:35, img:'carottes.jpg'},
  {id:7, name:'Oeufs', price:3.00, quantity:50, img:'oeufs.jpg'},
  {id:8, name:'Fromage', price:4.50, quantity:25, img:'fromage.jpg'},
];

let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

const productsContainer = document.getElementById('products-container');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const cartItemsContainer = document.getElementById('cart-items');

function renderProducts() {
  productsContainer.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const imagePath = p.img; 

    card.innerHTML = `
      <img src="${imagePath}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>Prix: €${p.price.toFixed(2)}</p>
      <p>Quantité dispo: ${p.quantity}</p>
      <button onclick="addToCart(${p.id})" ${p.quantity <= 0 ? 'disabled' : ''}>
        ${p.quantity <= 0 ? 'Rupture de stock' : 'Ajouter au panier'}
      </button>
    `;
    productsContainer.appendChild(card);
  });
}

function addToCart(productId){
  const product = products.find(p => p.id === productId);
  if(product.quantity <= 0){
    alert('Produit en rupture de stock !');
    return;
  }

  const cartItem = cart.find(c => c.id === productId);
  if(cartItem){
    cartItem.qty++;
  } else {
    cart.push({
      id: product.id, 
      name: product.name, 
      price: product.price, 
      qty: 1, 
      img: product.img,
      maxQuantity: product.quantity
    });
  }

  product.quantity--;
  updateCart();
  renderProducts();
}

function changeQuantity(productId, change) {
  const cartItem = cart.find(c => c.id === productId);
  const product = products.find(p => p.id === productId);

  if (!cartItem || !product) return;

  const newQty = cartItem.qty + change;

  if (newQty < 1) {
    removeFromCart(productId);
    return;
  }

  
  const totalRequested = newQty;
  const currentStock = product.quantity + cartItem.qty; 
  
  if (totalRequested > currentStock) {
    alert(`Quantité non disponible ! Stock maximum: ${currentStock}`);
    return;
  }

  product.quantity += cartItem.qty - newQty;
  cartItem.qty = newQty;

  updateCart();
  renderProducts();
}
 
function removeFromCart(productId) {
  const cartIndex = cart.findIndex(c => c.id === productId);
  if (cartIndex === -1) return;

  const cartItem = cart[cartIndex];
  const product = products.find(p => p.id === productId);

  product.quantity += cartItem.qty;

  cart.splice(cartIndex, 1);

  updateCart();
  renderProducts();
}

function renderCartItems() {
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Votre panier est vide.</p>';
    return;
  }

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    
    itemDiv.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <span><strong>${item.name}</strong></span>
        <p>€${item.price.toFixed(2)} / unité</p>
        <small>Stock disponible: ${product.quantity}</small>
      </div>
      <div class="cart-item-controls">
        <button onclick="changeQuantity(${item.id}, -1)">−</button>
        <input type="number" 
               value="${item.qty}" 
               min="1" 
               max="${product.quantity + item.qty}"
               onchange="updateQuantityFromInput(${item.id}, this.value)">
        <button onclick="changeQuantity(${item.id}, 1)">+</button>
      </div>
      <div class="cart-item-total">
        <strong>€${(item.price * item.qty).toFixed(2)}</strong>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Supprimer">🗑️</button>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });
}

function updateQuantityFromInput(productId, newValue) {
  const newQty = parseInt(newValue);
  if (isNaN(newQty) || newQty < 1) return;

  const cartItem = cart.find(c => c.id === productId);
  const product = products.find(p => p.id === productId);

  if (!cartItem || !product) return;

  const change = newQty - cartItem.qty;
  
  if (change === 0) return;

  const totalRequested = newQty;
  const currentStock = product.quantity + cartItem.qty;
  
  if (totalRequested > currentStock) {
    alert(`Quantité non disponible ! Stock maximum: ${currentStock}`);
    renderCartItems();
    return;
  }

  product.quantity -= change;
  cartItem.qty = newQty;

  updateCart();
  renderProducts();
}

function updateCart(){
  let totalQty = 0;
  let totalPrice = 0;
  
  cart.forEach(item => {
    totalQty += item.qty;
    totalPrice += item.qty * item.price;
  });
  
  cartCount.textContent = totalQty;
  cartTotal.textContent = totalPrice.toFixed(2);
  
  sessionStorage.setItem('cart', JSON.stringify(cart));
  
  renderCartItems();
  
  updateCheckoutButton();
}

function updateCheckoutButton() {
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    if (cart.length === 0) {
      checkoutBtn.disabled = true;
      checkoutBtn.style.opacity = '0.6';
      checkoutBtn.textContent = 'Panier vide';
    } else {
      checkoutBtn.disabled = false;
      checkoutBtn.style.opacity = '1';
      checkoutBtn.textContent = `Procéder au Paiement (€${cartTotal.textContent})`;
    }
  }
}

renderProducts();
updateCart();