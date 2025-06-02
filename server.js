const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs"); // <--- Adicione esta linha para importar o bcryptjs

const app = express();
const PORT = 5500;

// Adicione antes de app.use(...)
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy",
  "default-src 'self'; " + // self para seus próprios recursos
  "script-src 'self' https://www.gstatic.com https://translate.googleapis.com; " + // Permite scripts do Google
  "style-src 'self' 'unsafe-inline' https://www.gstatic.com; " + // Permite estilos do seu site, inline e do Google
  "img-src 'self' data:; " + // Permite imagens do seu site e data URIs (para ícones, etc.)
  "connect-src 'self' https://translate.googleapis.com;"); // Permite conexões (fetch)
});

app.use(bodyParser.json());
app.use(express.static("public"));

// Utilitário para carregar e salvar usuários em JSON
const USERS_FILE = "users.json";

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    // Se o arquivo não existir, cria um array vazio e salva
    saveUsers([]);
    return [];
  }
  const fileContent = fs.readFileSync(USERS_FILE, 'utf8');
  // Adiciona um try-catch para lidar com arquivos JSON vazios ou corrompidos
  try {
    return JSON.parse(fileContent);
  } catch (e) {
    console.error("Erro ao ler users.json, arquivo pode estar vazio ou corrompido:", e);
    // Cria um arquivo vazio para evitar futuros erros se estiver corrompido
    saveUsers([]);
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// Rota: Registro
app.post("/api/register", async (req, res) => { // <--- Tornar a função assíncrona (async)
  const { nome, email, senha, lembrete } = req.body;

  if (!nome || !email || !senha || !lembrete) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const users = loadUsers();
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: "Email já cadastrado." });
  }

  try {
    // 1. Gerar o salt (uma string aleatória)
    const salt = await bcrypt.genSalt(10); // O "10" é o custo de processamento, ajuste se necessário (maior = mais seguro, mais lento)

    // 2. Gerar o hash da senha
    const hashedPassword = await bcrypt.hash(senha, salt); // A senha do usuário é hashed com o salt

    // Salva o usuário com a senha HASHED, não a senha original
    users.push({ nome, email, senha: hashedPassword, lembrete }); // <--- Senha agora é o hash
    saveUsers(users);
    res.status(201).json({ message: "Cadastro realizado com sucesso!" });

  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor ao registrar usuário." });
  }
});

// Rota: Login
app.post("/api/login", async (req, res) => { // <--- Tornar a função assíncrona (async)
  const { email, senha } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.email === email); // Encontra o usuário pelo email

  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas." }); // Email não encontrado
  }

  try {
    // Comparar a senha fornecida com o hash armazenado
    const isMatch = await bcrypt.compare(senha, user.senha); // <--- Compara a senha digitada com o hash

    if (!isMatch) {
      return res.status(401).json({ error: "Credenciais inválidas." }); // Senha não corresponde
    }

    res.json({ message: "Login realizado com sucesso!" });

  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro interno do servidor ao tentar login." });
  }
});

// Rota: Buscar lembrete (não precisa de alteração)
app.post("/api/lembrete", (req, res) => {
  const { email } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.email === email);

  if (!user) return res.status(404).json({ error: "Email não encontrado." });
  res.json({ lembrete: user.lembrete });
});


// Rota para servir a página inicial (se necessário)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});