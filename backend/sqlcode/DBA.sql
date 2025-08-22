CREATE DATABASE biblioteca;
USE biblioteca;

-- Tabela de Usuários
CREATE TABLE user_tb (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Livros
CREATE TABLE book_tb (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(150) NOT NULL,
    genero VARCHAR(50),
    ano INT,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Empréstimos
CREATE TABLE loans_tb (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    bookId INT NOT NULL,
    date DATE NOT NULL,
    returnDate DATE,
    status VARCHAR(20) DEFAULT 'pendente',
    FOREIGN KEY (userId) REFERENCES user_tb(id),
    FOREIGN KEY (bookId) REFERENCES book_tb(id)
);
