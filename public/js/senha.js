document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('reset-password-form');
  const emailInput = document.getElementById('email');
  const newPasswordInput = document.getElementById('new-password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const successMsg = document.getElementById('success-msg');
  const errorMsg = document.getElementById('error-msg');

  if (
    !(form instanceof HTMLFormElement) ||
    !(emailInput instanceof HTMLInputElement) ||
    !(newPasswordInput instanceof HTMLInputElement) ||
    !(confirmPasswordInput instanceof HTMLInputElement) ||
    !(successMsg instanceof HTMLElement) ||
    !(errorMsg instanceof HTMLElement)
  ) {
    console.error("Erro ao carregar elementos do DOM.");
    return;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    successMsg.textContent = '';
    errorMsg.textContent = '';

    const email = emailInput.value.trim();
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!email || !newPassword || !confirmPassword) {
      errorMsg.textContent = 'Por favor, preencha todos os campos.';
      return;
    }

    if (newPassword !== confirmPassword) {
      errorMsg.textContent = 'As senhas não coincidem.';
      return;
    }

    if (newPassword.length < 6) {
      errorMsg.textContent = 'A senha deve ter no mínimo 6 caracteres.';
      return;
    }

    successMsg.textContent = 'Um email foi enviado com instruções para redefinir sua senha.';
    form.reset();
  });
});
