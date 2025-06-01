document.addEventListener("DOMContentLoaded", function () {
  const nomeInput = document.getElementById("new-name");
  const emailInput = document.getElementById("new-email");
  const passwordInput = document.getElementById("new-password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const lembreteInput = document.getElementById("new-lembrete");
  const formulario = document.getElementById("cadastro-form");
  const msg = document.getElementById("cadastro-msg");

  formulario.addEventListener("submit", async function (event) {
    event.preventDefault();
    msg.innerText = "";

    if (!validateNome(nomeInput.value)) {
      msg.innerText = "Por favor, insira apenas letras e espaços no campo Nome.";
      return;
    }

    if (!validateEmail(emailInput.value)) {
      msg.innerText = "Por favor, insira um endereço de email válido.";
      return;
    }

    if (!validatePassword(passwordInput.value)) {
      msg.innerText =
        "A senha deve conter pelo menos 8 caracteres, incluindo pelo menos uma letra e um número.";
      return;
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
      msg.innerText = "As senhas não correspondem.";
      return;
    }

    if (lembreteInput.value.trim().length === 0) {
      msg.innerText = "Por favor, preencha o campo de lembrete de senha.";
      return;
    }

    const payload = {
      nome: nomeInput.value.trim(),
      email: emailInput.value.trim(),
      senha: passwordInput.value,
      lembrete: lembreteInput.value.trim(),
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        msg.innerText = data.error || "Erro desconhecido ao cadastrar.";
        return;
      }

      msg.innerText = data.message;
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } catch (error) {
      console.error("Falha na conexão:", error);
      msg.innerText = "Erro de conexão com o servidor.";
    }
  });

  // Validações
  function validateNome(nome) {
    return /^[A-Za-zÀ-ú\s]+$/.test(nome.trim());
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function validatePassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  }

  // Alternar visibilidade da senha
  document
    .getElementById("toggle-new-password")
    .addEventListener("click", () => togglePassword("new-password", "toggle-new-password"));
  document
    .getElementById("toggle-confirm-password")
    .addEventListener("click", () => togglePassword("confirm-password", "toggle-confirm-password"));

  function togglePassword(fieldId, toggleId) {
    const input = document.getElementById(fieldId);
    const toggle = document.getElementById(toggleId);
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    toggle.innerHTML = isHidden ? "&#128065;&#65039;" : "&#128065;";
  }
});
