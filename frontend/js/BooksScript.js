const apiUrl = 'http://localhost:3000/books'; // porta 3001!

const form = document.querySelector('.books-form'); 

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tituloInput = document.getElementById('tituloLivro').value;
    const autorInput = document.getElementById('autorLivro').value;
    const generoInput = document.getElementById('generoLivro').value;
    const anoInput = document.getElementById('anoPublicacao').value;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo: tituloInput,
                autor: autorInput,
                genero: generoInput,
                ano: anoInput,
            }),
        });

        if (!response.ok) throw new Error('Erro na requisição');

        const livro = await response.json();
        form.reset();
        console.log('Success:', livro);
        alert('Livro cadastrado com sucesso!');
    } catch (error) {
        console.error('Error:', error);
        alert('Erro ao cadastrar livro. Tente novamente.');
    }
});
