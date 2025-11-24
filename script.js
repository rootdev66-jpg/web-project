const forgotForm = document.getElementById('forgotForm');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submitBtn');
const buttonText = document.getElementById('buttonText');
const buttonLoading = document.getElementById('buttonLoading');
const errorBox = document.getElementById('error');
const errorText = document.getElementById('errorText');
const successBox = document.getElementById('success');
const successText = document.getElementById('successText');
const codeDisplay = document.getElementById('codeDisplay');
const verificationCodeSpan = document.getElementById('verificationCode');

forgotForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = emailInput.value.trim();
  
  errorBox.style.display = 'none';
  successBox.style.display = 'none';
  codeDisplay.style.display = 'none';
  
  if (!email) {
    showError('Veuillez entrer votre adresse e-mail.');
    return;
  }
  
  if (!isValidEmail(email)) {
    showError('Veuillez entrer une adresse e-mail valide.');
    return;
  }
  
  simulateSendEmail(email);
});

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showError(message) {
  errorText.textContent = message;
  errorBox.style.display = 'flex';
  emailInput.focus();
}

function showSuccess(message) {
  successText.textContent = message;
  successBox.style.display = 'flex';
}

function simulateSendEmail(email) {
  submitBtn.disabled = true;
  buttonText.textContent = 'Envoi en cours...';
  buttonLoading.style.display = 'inline-block';
  
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  
  setTimeout(() => {
    sessionStorage.setItem('tempResetCode', verificationCode);
    sessionStorage.setItem('tempResetEmail', email);
    
    showSuccess('Code de vérification envoyé avec succès!');
    verificationCodeSpan.textContent = verificationCode;
    codeDisplay.style.display = 'block';
    
    submitBtn.disabled = false;
    buttonText.textContent = 'Envoyer le code de vérification';
    buttonLoading.style.display = 'none';
    
    setTimeout(() => {
      window.location.href = 'reset-code.html';
    }, 3000);
    
  }, 2000);
}