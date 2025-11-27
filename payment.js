
class PaymentSystem {
    constructor() {
        this.init();
    }

    init() {
        this.loadOrderSummary();
        this.setupEventListeners();
        this.setupInputFormatters();
    }

    loadOrderSummary() {
        const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const orderItems = document.getElementById('order-items');
        const orderTotal = document.getElementById('order-total');
        const payAmount = document.getElementById('payAmount');

        if (cart.length === 0) {
            orderItems.innerHTML = '<p>Votre panier est vide</p>';
            orderTotal.textContent = '0.00';
            payAmount.textContent = '0.00';
            document.getElementById('payButton').disabled = true;
            return;
        }
        
        orderItems.innerHTML = '';

        cart.forEach(item => {
            if (item.qty > 0) {
                const itemTotal = item.price * item.qty;
                total += itemTotal;

                const itemDiv = document.createElement('div');
                itemDiv.className = 'order-item';
                itemDiv.innerHTML = `
                    <span>${item.name} x${item.qty}</span>
                    <span>€${itemTotal.toFixed(2)}</span>
                `;
                orderItems.appendChild(itemDiv);
            }
        });

        orderTotal.textContent = total.toFixed(2);
        payAmount.textContent = total.toFixed(2);
    }

    setupEventListeners() {
        const form = document.getElementById('paymentForm');
        form.addEventListener('submit', (e) => this.handlePayment(e));

        // Validation en temps réel
        document.getElementById('cardNumber').addEventListener('input', (e) => this.formatCardNumber(e));
        document.getElementById('expiryDate').addEventListener('input', (e) => this.formatExpiryDate(e));
    }

    setupInputFormatters() {
        // Formatter le numéro de téléphone
        document.getElementById('phone').addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.match(/.{1,2}/g).join(' ');
            }
            e.target.value = value;
        });
    }

    formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
        if (value.length > 0) {
            value = value.match(/.{1,4}/g).join(' ');
        }
        e.target.value = value.substring(0, 19);
    }

    formatExpiryDate(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value.substring(0, 5);
    }

    validateForm() {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardHolder = document.getElementById('cardHolder').value;
        const phone = document.getElementById('phone').value;

        
        if (!/^\d{16}$/.test(cardNumber)) {
            throw new Error('Numéro de carte invalide (16 chiffres requis)');
        }

        
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            throw new Error('Format de date invalide (MM/AA requis)');
        }

        
        if (!/^\d{3}$/.test(cvv)) {
            throw new Error('CVV invalide (3 chiffres requis)');
        }

        
        if (cardHolder.trim().length < 3) {
            throw new Error('Nom du titulaire invalide');
        }

        
        if (phone.replace(/\s/g, '').length < 10) {
            throw new Error('Numéro de téléphone invalide');
        }

        return true;
    }

    async handlePayment(e) {
        e.preventDefault();
        
        const errorBox = document.getElementById('error');
        const successBox = document.getElementById('success');
        const payButton = document.getElementById('payButton');
        const buttonText = payButton.querySelector('.button-text');
        const buttonLoading = payButton.querySelector('.button-loading');

        errorBox.textContent = '';
        successBox.style.display = 'none';

        try {
                        this.validateForm();

            
            buttonText.style.display = 'none';
            buttonLoading.style.display = 'inline';
            payButton.disabled = true;

            
            await new Promise(resolve => setTimeout(resolve, 2000));

            
            successBox.textContent = '✅ Paiement réussi ! Votre commande est confirmée.';
            successBox.style.display = 'block';

                        sessionStorage.removeItem('cart');
            
            
            setTimeout(() => {
                window.location.href = 'market.html';
            }, 3000);

        } catch (error) {
            errorBox.textContent = error.message;
            buttonText.style.display = 'inline';
            buttonLoading.style.display = 'none';
            payButton.disabled = false;
        }
    }
    
async handlePayment(e) {
    e.preventDefault();
    
    const errorBox = document.getElementById('error');
    const successBox = document.getElementById('success');
    const payButton = document.getElementById('payButton');
    const buttonText = payButton.querySelector('.button-text');
    const buttonLoading = payButton.querySelector('.button-loading');

    errorBox.textContent = '';
    successBox.style.display = 'none';

    try {
                this.validateForm();

        
        buttonText.style.display = 'none';
        buttonLoading.style.display = 'inline';
        payButton.disabled = true;

        
        await new Promise(resolve => setTimeout(resolve, 2000));

        
        this.saveTransactionData();

        
        window.location.href = 'receipt.html';

    } catch (error) {
        errorBox.textContent = error.message;
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
        payButton.disabled = false;
    }
}


saveTransactionData() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const cardNumber = document.getElementById('cardNumber').value;
    const now = new Date();
    
    const transactionData = {
        id: 'TXN-' + now.getTime(),
        date: now.toLocaleDateString('fr-FR'),
        time: now.toLocaleTimeString('fr-FR'),
        items: cart.map(item => ({
            name: item.name,
            quantity: item.qty,
            price: item.price
        })),
        cardLastFour: cardNumber.slice(-4),
        authCode: 'AUTH-' + Math.floor(100000 + Math.random() * 900000),
        subtotal: this.calculateSubtotal(cart),
        serviceFee: 0.50,
        grandTotal: this.calculateSubtotal(cart) + 0.50
    };
    
    
    sessionStorage.setItem('lastTransaction', JSON.stringify(transactionData));
    
    
    sessionStorage.removeItem('cart');
}

calculateSubtotal(cart) {
    return cart.reduce((total, item) => total + (item.price * item.qty), 0);
}
}


document.addEventListener('DOMContentLoaded', () => {
    new PaymentSystem();
});