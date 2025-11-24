const products = [
  {id:1, name:'Tomates bio', price:2.50, quantity:50, img:'images/tomatebio.jpg'},
  {id:2, name:'Fraises fraîches', price:3.80, quantity:30, img:'images/fraises.jpg'},
  {id:3, name:'Lait frais', price:1.20, quantity:20, img:'images/lait.png'},
  {id:4, name:'Pain complet', price:2.00, quantity:15, img:'images/pain.jpg'},
  {id:5, name:'Pommes', price:2.30, quantity:40, img:'images/pommes.jpg'},
  {id:6, name:'Carottes', price:1.50, quantity:35, img:'images/carottes.jpg'},
  {id:7, name:'Oeufs', price:3.00, quantity:50, img:'images/oeufs.jpg'},
  {id:8, name:'Fromage', price:4.50, quantity:25, img:'images/fromage.jpg'}
];

const cart = [];

const productsContainer = document.getElementById('products-container');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const cartItems = document.getElementById('cart-items');

function renderProducts() {
  productsContainer.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" style="width:150px;height:150px;object-fit:cover;">
      <h3>${p.name}</h3>
      <p>Prix: €${p.price.toFixed(2)}</p>
      <p>Quantité dispo: ${p.quantity}</p>
      <button onclick="addToCart(${p.id})">Ajouter au panier</button>
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
    cart.push({id:product.id, name:product.name, price:product.price, qty:1, img:product.img});
  }

  product.quantity--;
  updateCart();
  renderProducts();
}

function removeFromCart(productId){
  const cartItem = cart.find(c => c.id === productId);
  if(!cartItem) return;

  const product = products.find(p => p.id === productId);
  product.quantity += cartItem.qty;

  const index = cart.findIndex(c => c.id === productId);
  cart.splice(index,1);
  updateCart();
  renderProducts();
}

function changeQty(productId, qty){
  const cartItem = cart.find(c => c.id === productId);
  if(!cartItem) return;

  const product = products.find(p => p.id === productId);
  if(qty < 1) return;
  if(qty - cartItem.qty > product.quantity) {
    alert('Quantité disponible dépassée');
    return;
  }

  product.quantity -= (qty - cartItem.qty);
  cartItem.qty = qty;
  updateCart();
  renderProducts();
}

function updateCart(){
  let totalQty = 0;
  let totalPrice = 0;
  cartItems.innerHTML = '';
  cart.forEach(item => {
    totalQty += item.qty;
    totalPrice += item.qty * item.price;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}" style="width:50px;height:50px;object-fit:cover;">
      <span>${item.name}</span>
      <span>€${item.price.toFixed(2)}</span>
      <input type="number" min="1" value="${item.qty}" onchange="changeQty(${item.id}, parseInt(this.value))">
      <button onclick="removeFromCart(${item.id})">Supprimer</button>
    `;
    cartItems.appendChild(div);
  });
  cartCount.textContent = totalQty;
  cartTotal.textContent = totalPrice.toFixed(2);
}

renderProducts();
