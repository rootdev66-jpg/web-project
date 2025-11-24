class ReceiptSystem {
    constructor() {
        this.transactionData = null;
        this.init();
    }

    init() {
        this.loadTransactionData();
        this.renderReceipt();
        this.setupEventListeners();
    }

    loadTransactionData() {
        this.transactionData = JSON.parse(sessionStorage.getItem('lastTransaction')) || this.generateDemoData();
        
        if (!this.transactionData) {
            this.transactionData = this.generateDemoData();
        }
    }

    generateDemoData() {
        const now = new Date();
        return {
            id: 'TXN-' + now.getTime(),
            date: now.toLocaleDateString('fr-FR'),
            time: now.toLocaleTimeString('fr-FR'),
            items: [
                { name: 'Tomates bio', quantity: 2, price: 2.50 },
                { name: 'Fraises fraîches', quantity: 1, price: 3.80 },
                { name: 'Pain complet', quantity: 1, price: 2.00 }
            ],
            cardLastFour: '3456',
            authCode: 'AUTH-' + Math.floor(100000 + Math.random() * 900000),
            subtotal: 11.10,
            serviceFee: 0.50,
            grandTotal: 11.60
        };
    }

    renderReceipt() {
        this.renderTransactionInfo();
        this.renderOrderItems();
        this.renderTotals();
        this.renderPaymentInfo();
    }

    renderTransactionInfo() {
        document.getElementById('transaction-id').textContent = this.transactionData.id;
        document.getElementById('transaction-date').textContent = this.transactionData.date;
        document.getElementById('transaction-time').textContent = this.transactionData.time;
        document.getElementById('barcode-number').textContent = this.transactionData.id.replace('TXN-', '');
    }

    renderOrderItems() {
        const itemsContainer = document.getElementById('receipt-items');
        itemsContainer.innerHTML = '';

        this.transactionData.items.forEach(item => {
            const itemTotal = item.quantity * item.price;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'receipt-item';
            itemDiv.innerHTML = `
                <span class="item-name">${item.name}</span>
                <span class="item-details">${item.quantity} x €${item.price.toFixed(2)}</span>
                <span class="item-price">€${itemTotal.toFixed(2)}</span>
            `;
            itemsContainer.appendChild(itemDiv);
        });
    }

    renderTotals() {
        document.getElementById('subtotal').textContent = `€${this.transactionData.subtotal.toFixed(2)}`;
        document.getElementById('service-fee').textContent = `€${this.transactionData.serviceFee.toFixed(2)}`;
        document.getElementById('grand-total').textContent = `€${this.transactionData.grandTotal.toFixed(2)}`;
        
        const checkoutTotal = document.getElementById('checkout-total');
        if (checkoutTotal) {
            checkoutTotal.textContent = this.transactionData.grandTotal.toFixed(2);
        }
    }

    renderPaymentInfo() {
        document.getElementById('card-number').textContent = `**** **** **** ${this.transactionData.cardLastFour}`;
        document.getElementById('auth-code').textContent = this.transactionData.authCode;
    }

    setupEventListeners() {
    }
}

function goToMarket() {
    window.location.href = 'market.html';
}

function downloadReceipt() {
    const receiptContent = document.querySelector('.receipt-card').innerHTML;
    const blob = new Blob([`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Reçu Marché de Printemps</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                ${document.querySelector('style').innerHTML}
            </style>
        </head>
        <body>${receiptContent}</body>
        </html>
    `], { type: 'application/pdf' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recu-${document.getElementById('transaction-id').textContent}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('📥 Reçu téléchargé (simulation)');
}

document.addEventListener('DOMContentLoaded', () => {
    new ReceiptSystem();
});