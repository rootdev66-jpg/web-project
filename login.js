
class LoginSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAnimations();
    }

    setupEventListeners() {
        const form = document.getElementById('loginForm');
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');

        
        form.addEventListener('submit', (e) => this.handleLogin(e));

        
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });

        
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });

        
        const socialButtons = document.querySelectorAll('.social-btn');
        socialButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.showError('Fonctionnalité en cours de développement');
            });
        });
    }

    setupAnimations() {
                const animatedElements = document.querySelectorAll('.form-content > *');
        animatedElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorBox = document.getElementById('error');
        const loginBtn = document.getElementById('loginBtn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoader = loginBtn.querySelector('.btn-loader');

        
        errorBox.style.display = 'none';
        errorBox.textContent = '';

                if (!username || !password) {
            this.showError('Veuillez remplir tous les champs');
            return;
        }

        if (password.length < 8) {
            this.showError('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        
        try {
            
            btnText.style.display = 'none';
            btnLoader.style.display = 'block';
            loginBtn.disabled = true;

            
            await new Promise(resolve => setTimeout(resolve, 2000));

            
            if (username === 'vendeur' && password === '12345678') {
                this.showLoadingScreen();
                
                
                setTimeout(() => {
                    window.location.href = 'market.html';
                }, 3000);
                
            } else {
                throw new Error('Identifiants incorrects');
            }

        } catch (error) {
            this.showError(error.message);
            
            
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
            loginBtn.disabled = false;
        }
    }

    showError(message) {
        const errorBox = document.getElementById('error');
        errorBox.textContent = message;
        errorBox.style.display = 'block';
        
        
        errorBox.style.animation = 'none';
        setTimeout(() => {
            errorBox.style.animation = 'shake 0.5s ease-in-out';
        }, 10);
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.style.display = 'flex';
        
        
        setTimeout(() => {
            loadingScreen.style.opacity = '1';
        }, 10);
    }
}


const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);


document.addEventListener('DOMContentLoaded', () => {
    new LoginSystem();
});