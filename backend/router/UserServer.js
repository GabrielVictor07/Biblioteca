const express = require('express');
const router = express.Router();
const db = require('../db');

// =======================
// POST /users - criar usuário
// =======================
router.post('/', (req, res) => {
  const { nome, email, cpf } = req.body;

  // Validação simples
  if (!nome || !email || !cpf) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  db.query(
    'INSERT INTO user_tb (nome, email, cpf) VALUES (?, ?, ?)',
    [nome, email, cpf],
    (err, result) => {
      if (err) {
        console.error('Erro ao inserir usuário:', err);
        // Mensagem mais amigável se for CPF ou email duplicado
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Email ou CPF já cadastrado' });
        }
        return res.status(500).json({ error: 'Erro ao inserir usuário no banco' });
      }

      res.status(201).json({
        id: result.insertId,
        nome,
        email,
        cpf,
        data_cadastro: new Date() // ou pegar do banco se quiser SELECT depois
      });
    }
  );
});

// =======================
// GET /users - listar todos
// =======================
router.get('/', (req, res) => {
  db.query('SELECT id, nome, email, cpf, data_cadastro FROM user_tb', (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
    res.json(results);
  });
});

module.exports = router;