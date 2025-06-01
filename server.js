// server.js
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 5500;

// Adicione antes de app.use(...)
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy",
    "default-src 'self' https://www.gstatic.com https://translate.googleapis.com; style-src 'self' 'unsafe-inline' https://www.gstatic.com;");
  next();
});


app.use(bodyParser.json());
app.use(express.static("public"));

// Utilitário para carregar e salvar usuários em JSON
const USERS_FILE = "users.json";
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
}
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Rota: Registro
app.post("/api/register", (req, res) => {
  const { nome, email, senha, lembrete } = req.body;
  if (!nome || !email || !senha || !lembrete)
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });

  const users = loadUsers();
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: "Email já cadastrado." });
  }

  users.push({ nome, email, senha, lembrete });
  saveUsers(users);
  res.status(201).json({ message: "Cadastro realizado com sucesso!" });
});

// Rota: Login
app.post("/api/login", (req, res) => {
  const { email, senha } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.email === email && u.senha === senha);

  if (!user) return res.status(401).json({ error: "Credenciais inválidas." });
  res.json({ message: "Login realizado com sucesso!" });
});

// Rota: Buscar lembrete
app.post("/api/lembrete", (req, res) => {
  const { email } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.email === email);

  if (!user) return res.status(404).json({ error: "Email não encontrado." });
  res.json({ lembrete: user.lembrete });
});


const path = require("path");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
