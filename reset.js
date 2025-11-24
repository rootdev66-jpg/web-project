if (document.getElementById('forgotForm')) {
    const forgotForm = document.getElementById('forgotForm');
    const errorBox = document.getElementById('error');
    const successBox = document.getElementById('success');

    forgotForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        errorBox.textContent = '';
        successBox.textContent = '';
        successBox.style.display = 'none';

        if (!email) {
            errorBox.textContent = 'Veuillez entrer votre adresse e-mail.';
            return;
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        
        sessionStorage.setItem('tempResetCode', verificationCode);
        sessionStorage.setItem('tempResetEmail', email);

        successBox.textContent = `Code de vérification (SIMULATION) : ${verificationCode}`;
        successBox.style.display = 'block';

        setTimeout(() => {
            window.location.href = 'reset-code.html';
        }, 2000);
    });
}

if (document.getElementById('codeForm')) {
    const codeForm = document.getElementById('codeForm');
    const errorBox = document.getElementById('error');
    const storedCode = sessionStorage.getItem('tempResetCode'); 
    const storedEmail = sessionStorage.getItem('tempResetEmail');

    if (!storedCode || !storedEmail) {
        errorBox.textContent = 'Erreur: Veuillez recommencer le processus de réinitialisation.';
        if(codeForm) codeForm.style.display = 'none';
    }

    if(codeForm) codeForm.addEventListener('submit', e => {
        e.preventDefault();
        const enteredCode = document.getElementById('resetCode').value.trim();
        errorBox.textContent = '';
        
        if (enteredCode === String(storedCode)) { 
            window.location.href = 'reset-password.html';
        } else {
            errorBox.textContent = 'Code incorrect. Veuillez réessayer.';
        }
    });
}

if (document.getElementById('newPasswordForm')) {
    const newPasswordForm = document.getElementById('newPasswordForm');
    const errorBox = document.getElementById('error');
    const storedEmail = sessionStorage.getItem('tempResetEmail');

    if (!storedEmail) {
        errorBox.textContent = 'Erreur: Processus interrompu. Veuillez recommencer.';
        if(newPasswordForm) newPasswordForm.style.display = 'none';
    }

    if(newPasswordForm) newPasswordForm.addEventListener('submit', e => {
        e.preventDefault();
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        errorBox.textContent = '';

        if (newPassword.length < 8) {
            errorBox.textContent = 'Le nouveau mot de passe doit contenir au moins 8 caractères.';
            return;
        }

        if (newPassword !== confirmPassword) {
            errorBox.textContent = 'Les mots de passe ne correspondent pas.';
            return;
        }
        
        alert(`Le mot de passe pour l'utilisateur ${storedEmail} a été modifié avec succès (SIMULATION).`);

        sessionStorage.removeItem('tempResetCode');
        sessionStorage.removeItem('tempResetEmail');
        window.location.href = 'login.html';
    });
}