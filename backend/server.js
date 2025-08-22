const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Configurações globais
app.use(cors());
app.use(express.json());

// Importa as rotas (cada uma vai ter suas funções CRUD)
const booksRoutes = require('./router/BooksServer');
const userRoutes = require('./router/UserServer')
const loansRoutes = require('./router/EmprestimoServer');

// Usa as rotas
app.use('/books', booksRoutes);
app.use('/users', userRoutes);
app.use('/loans', loansRoutes);

// Inicia servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
