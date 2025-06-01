document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault();
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // Lógica de autenticação (exemplo: usuário "admin" e senha "admin")
  if (username === "admin" && password === "admin") {
    alert("Login bem-sucedido!");
    // Aqui você pode redirecionar para outra página, se necessário
  } else {
    document.getElementById("error-msg").innerText = "Usuário ou senha incorretos.";
  }
});
