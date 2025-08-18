// frontend/js/BooksScript.js
// BooksScript.js - Script to handle book registration form submission
// This script listens for the form submission, collects the input data,
// and sends it to the backend API to register a new book.

const apiUrl = 'http://localhost:3000/books'; // Update with your actual API endpoint

const form = document.querySelector('.books-form'); 

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const livroInput = document.getElementById('idLivro').value;
    const tituloInput = document.getElementById('tituloLivro').value;
    const autorInput = document.getElementById('autorLivro').value;
    const generoInput = document.getElementById('generoLivro').value;
    const anoInput = document.getElementById('anoPublicacao').value;
    // Validate inputs

    try { // Check if all fields are filled
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: livroInput,
                titulo: tituloInput,
                autor: autorInput,
                genero: generoInput,
                anoPublicacao: anoInput,
            }),
        });

        if (!response.ok) { 
            throw new Error('A resposta da rede não foi bem-sucedida');
        }
        // Check if all fields are filled
        // Check if the response is ok
        // If not, throw an error to be caught in the catch block
        // Parse the JSON response
        const livro = await response.json(); 
        form.reset();
        console.log('Success:', livro);
        alert('Livro cadastrado com sucesso!');
    } catch (error) {
        console.error('Error:', error);
        alert('Erro ao cadastrar livro. Tente novamente.');
    }
});