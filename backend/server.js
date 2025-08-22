const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Arquivos JSON
const USERS_FILE = path.join(__dirname, 'users.json');
const BOOKS_FILE = path.join(__dirname, 'books.json');
const LOANS_FILE = path.join(__dirname, 'loans.json');

// Funções para ler e escrever JSON
function readJSON(file) {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// -------------------- USERS --------------------
app.get('/users', (req, res) => res.json(readJSON(USERS_FILE)));

app.post('/users', (req, res) => {
  const users = readJSON(USERS_FILE);
  const { cpf, username, email } = req.body;
  const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = { id, cpf, username, email };
  users.push(newUser);
  writeJSON(USERS_FILE, users);
  res.status(201).json(newUser);
});

// -------------------- BOOKS --------------------

app.get('/books', (req, res) => res.json(readJSON(BOOKS_FILE)));

app.post('/books', (req, res) => {
  const books = readJSON(BOOKS_FILE);
  const { titulo, autor } = req.body;
  const id = books.length ? Math.max(...books.map(b => b.id)) + 1 : 1;
  const newBook = { id, titulo, autor };
  books.push(newBook);
  writeJSON(BOOKS_FILE, books);
  res.status(201).json(newBook);
});

// -------------------- LOANS --------------------

app.get('/loans', (req, res) => res.json(readJSON(LOANS_FILE)));

app.post('/loans', (req, res) => {
  const loans = readJSON(LOANS_FILE);
  const users = readJSON(USERS_FILE);
  const books = readJSON(BOOKS_FILE);

  let { userId, bookId, date, returnDate, status } = req.body;
  userId = Number(userId);
  bookId = Number(bookId);

  const user = users.find(u => u.id === userId);
  const book = books.find(b => b.id === bookId);

  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  if (!book) return res.status(404).json({ error: 'Livro não encontrado' });

  const id = loans.length ? Math.max(...loans.map(l => l.id)) + 1 : 1;

  const newLoan = {
    id,
    userId,
    bookId,
    date: date ? new Date(date).toISOString() : new Date().toISOString(),
    returnDate: returnDate ? new Date(returnDate).toISOString() : null,
    status: status || 'pendente'
  };

  loans.push(newLoan);
  writeJSON(LOANS_FILE, loans);
  res.status(201).json(newLoan);
});

app.put('/loans/:id', (req, res) => {
  const loans = readJSON(LOANS_FILE);
  const { id } = req.params;
  const { returnDate } = req.body;

  const loanIndex = loans.findIndex(l => l.id === parseInt(id));
  if (loanIndex === -1) return res.status(404).json({ error: 'Empréstimo não encontrado' });

  // Atualiza a data de devolução e o status
  loans[loanIndex].returnDate = returnDate ? new Date(returnDate).toISOString() : new Date().toISOString();
  loans[loanIndex].status = 'entregue';

  writeJSON(LOANS_FILE, loans);
  res.json(loans[loanIndex]);
});


// Deletar empréstimo
app.delete('/loans/:id', (req, res) => {
  const loans = readJSON(LOANS_FILE);
  const { id } = req.params;

  console.log('Rota DELETE chamada com id:', id); // <--- log do id recebido
  console.log('IDs existentes:', loans.map(l => l.id)); // <--- log dos IDs no JSON

  const loanIndex = loans.findIndex(l => l.id === parseInt(id));
  if (loanIndex === -1) {
    console.log('Empréstimo não encontrado');
    return res.status(404).json({ error: 'Empréstimo não encontrado' });
  }

  const deletedLoan = loans.splice(loanIndex, 1)[0];
  writeJSON(LOANS_FILE, loans);
  console.log('Empréstimo deletado:', deletedLoan);
  res.json(deletedLoan);
});

// -------------------- INICIA SERVIDOR --------------------
app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
