
//========================
// SERVIDOR DE LIVROS
//========================
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const BOOKS_FILE = path.join(__dirname, 'books.json');

app.use(cors());
app.use(express.json());

// FUNÇÕES UTILITÁRIAS
// Lê livros do arquivo JSON

function readBooks() {
  try {
    const data = fs.readFileSync(BOOKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Salva livros no arquivo JSON
function writeBooks(books) {
  fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null, 2), 'utf8');
}

// ROTAS DE LIVROS
// Cadastrar novo livro

app.post('/books', (req, res) => {
  const { id, titulo, autor, genero, ano } = req.body;
  const book = {
    id: id,
    titulo: titulo,
    autor: autor,
    genero: genero,
    ano: ano,
    data: new Date().toISOString(),
  };
  const books = readBooks();
  books.push(book);
  writeBooks(books);
  res.status(201).json(book);
});

// Listar todos os livros
app.get('/books', (req, res) => {
  const books = readBooks();
  res.status(200).json(books);
});

// Buscar livro por ID
app.get('/books/:id', (req, res) => {
  const { id } = req.params;
  const books = readBooks();
  const book = books.find(b => b.id === id);
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: 'Livro não encontrado' });
  }
});

// Editar livro pelo ID
app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, autor, genero, ano } = req.body;
  const books = readBooks();
  const bookIndex = books.findIndex(b => b.id === id);
  if (bookIndex !== -1) {
    books[bookIndex] = { ...books[bookIndex], titulo, autor, genero, ano };
    writeBooks(books);
    res.status(200).json(books[bookIndex]);
  } else {
    res.status(404).json({ message: 'Livro não encontrado' });
  }
});

// Deletar livro pelo ID
app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  let books = readBooks();
  const bookIndex = books.findIndex(b => b.id === id);
  if (bookIndex !== -1) {
    const deletedBook = books.splice(bookIndex, 1);
    writeBooks(books);
    res.status(200).json(deletedBook[0]);
  } else {
    res.status(404).json({ message: 'Livro não encontrado' });
  }
});

app.listen(port, () => {
  console.log(`Books server running at http://localhost:${port}`);
});