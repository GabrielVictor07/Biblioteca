const express = require('express');
const router = express.Router();
const db = require('../db');

// =======================
// POST /loans - criar empréstimo
// =======================
router.post('/', (req, res) => {
  let { userId, bookId, date, returnDate, status } = req.body;

  if (!userId || !bookId || !date) {
    return res.status(400).json({ error: 'userId, bookId e date são obrigatórios' });
  }

  db.query(
    'INSERT INTO loans_tb (userId, bookId, date, returnDate, status) VALUES (?, ?, ?, ?, ?)',
    [userId, bookId, date, returnDate || null, status || 'pendente'],
    (err, result) => {
      if (err) {
        console.error('Erro ao criar empréstimo:', err);
        return res.status(500).json({ error: 'Erro ao criar empréstimo' });
      }

      res.status(201).json({
        id: result.insertId,
        userId,
        bookId,
        date,
        returnDate: returnDate || null,
        status: status || 'pendente'
      });
    }
  );
});

// =======================
// GET /loans - listar todos empréstimos
// =======================
router.get('/', (req, res) => {
  db.query('SELECT * FROM loans_tb', (err, results) => {
    if (err) {
      console.error('Erro ao buscar empréstimos:', err);
      return res.status(500).json({ error: 'Erro ao buscar empréstimos' });
    }
    res.json(results);
  });
});

// =======================
// PUT /loans/:id - atualizar empréstimo (devolução)
// =======================
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { returnDate, status } = req.body;

  db.query(
    'UPDATE loans_tb SET returnDate = ?, status = ? WHERE id = ?',
    [returnDate, status, id],
    (err, result) => {
      if (err) {
        console.error('Erro ao atualizar empréstimo:', err);
        return res.status(500).json({ error: 'Erro ao atualizar empréstimo' });
      }
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Empréstimo não encontrado' });

      res.json({ id: Number(id), returnDate, status });
    }
  );
});

// =======================
// DELETE /loans/:id - deletar empréstimo
// =======================
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM loans_tb WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Erro ao deletar empréstimo:', err);
      return res.status(500).json({ error: 'Erro ao deletar empréstimo' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Empréstimo não encontrado' });

    res.json({ message: 'Empréstimo deletado com sucesso', id: Number(id) });
  });
});


router.put('/:id', (req, res) => {
  const { id } = req.params;
  let { returnDate, status } = req.body;
  
  if (!returnDate) returnDate = new Date().toISOString();
  if (!status) status = 'entregue';

  db.query(
    'UPDATE loans_tb SET returnDate = ?, status = ? WHERE id = ?',
    [returnDate, status, id],
    (err, result) => {
      if (err) {
        console.error('Erro ao atualizar empréstimo:', err);
        return res.status(500).json({ error: 'Erro ao atualizar empréstimo' });
      }
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Empréstimo não encontrado' });

      res.json({ id: Number(id), returnDate, status });
    }
  );
});

module.exports = router;
