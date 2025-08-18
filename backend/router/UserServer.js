
// =========================
// IMPORTAÇÕES E CONFIGS
// =========================
// Importa bibliotecas necessárias
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(cors()); 
app.use(express.json());

// =========================
// FUNÇÕES UTILITÁRIAS
// =========================
// Lê usuários do arquivo JSON
function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Salva usuários no arquivo JSON
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// =========================
// ROTAS DE USUÁRIO
// =========================

// Cadastrar novo usuário
app.post('/users', (req, res) => {
  const { cpf, username, email } = req.body;
  const user = {
    id: cpf,
    nome: username,
    livro: email,
    data: new Date().toISOString(),
  };
  const users = readUsers();
  users.push(user);
  writeUsers(users);
  res.status(201).json(user);
});

// Listar todos os usuários
app.get('/users', (req, res) => {
  const users = readUsers();
  res.status(200).json(users);
});

// Buscar usuário por CPF (id)
app.get('/users/:cpf', (req, res) => {
  const { cpf } = req.params;
  const users = readUsers();
  const user = users.find(u => u.id === cpf);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ mensagem: 'Usuário não encontrado' });
  }
});

// Editar usuário pelo CPF (id)
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  let users = readUsers();
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    users[userIndex].nome = username || users[userIndex].nome;
    users[userIndex].livro = email || users[userIndex].livro;
    writeUsers(users);
    res.status(200).json(users[userIndex]);
  } else {
    res.status(404).json({ mensagem: 'Usuário não encontrado' });
  }
});

// Deletar usuário pelo CPF (id)
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  let users = readUsers();
  users = users.filter(user => user.id !== id);
  writeUsers(users);
  res.status(204).send();
});

// =========================
// INICIAR SERVIDOR
// =========================
app.listen(port, () => {
  console.log(`User Server running at http://localhost:${port}`);
});