const express = require('express');
const router = express.Router();
const db = require('../db');

// =======================
// POST /books - criar livro
// =======================
router.post('/', (req, res) => {
  const { titulo, autor, genero, ano } = req.body;
  console.log('REQ BODY:', req.body);

  if (!titulo || !autor || !genero || !ano) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  db.query(
    'INSERT INTO book_tb (titulo, autor, genero, ano) VALUES (?, ?, ?, ?)',
    [titulo, autor, genero, ano],
    (err, result) => {
      if (err) {
        console.error('Erro ao inserir livro:', err);
        return res.status(500).json({ error: 'Erro ao inserir livro no banco' });
      }

      res.status(201).json({
        id: result.insertId,
        titulo,
        autor,
        genero,
        ano
      });
    }
  );
});

// =======================
// GET /books - listar todos
// =======================
router.get('/', (req, res) => {
  db.query('SELECT * FROM book_tb', (err, results) => {
    if (err) {
      console.error('Erro ao buscar livros:', err);
      return res.status(500).json({ error: 'Erro ao buscar livros' });
    }
    res.json(results);
  });
});

// =======================
// GET /books/:id - buscar por ID
// =======================
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM book_tb WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar livro por ID:', err);
      return res.status(500).json({ error: 'Erro ao buscar livro' });
    }
    if (results.length === 0) return res.status(404).json({ message: 'Livro não encontrado' });
    res.json(results[0]);
  });
});

// =======================
// PUT /books/:id - atualizar livro
// =======================
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, autor, genero, ano } = req.body;

  if (!titulo || !autor || !genero || !ano) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  db.query(
    'UPDATE book_tb SET titulo = ?, autor = ?, genero = ?, ano = ? WHERE id = ?',
    [titulo, autor, genero, ano, id],
    (err, result) => {
      if (err) {
        console.error('Erro ao atualizar livro:', err);
        return res.status(500).json({ error: 'Erro ao atualizar livro' });
      }
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Livro não encontrado' });
      res.json({ id: Number(id), titulo, autor, genero, ano });
    }
  );
});

module.exports = router;
