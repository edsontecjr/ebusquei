document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const formulario = document.getElementById('login-form');

  formulario.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validateEmail(emailInput.value)) {
      alert("Por favor, insira um endereço de email válido.");
    } else if (!validatePassword(passwordInput.value)) {
      alert("A senha deve conter pelo menos 8 caracteres, incluindo pelo menos uma letra e um número.");
    } else {
      window.location.href = 'compara.html';
    }
  });

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validatePassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  }

  const togglePasswordBtn = document.getElementById('toggle-password');
  togglePasswordBtn.addEventListener('click', function () {
    togglePasswordVisibility('password', 'toggle-password');
  });

  function togglePasswordVisibility(passwordFieldId, toggleButtonId) {
    const passwordInput = document.getElementById(passwordFieldId);
    const toggleButton = document.getElementById(toggleButtonId);
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleButton.innerHTML = '&#128065;&#65039;';
    } else {
      passwordInput.type = 'password';
      toggleButton.innerHTML = '&#128065;';
    }
  }
});
