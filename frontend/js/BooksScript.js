const apiUrl = 'http://localhost:3000/books';

const form = document.querySelector('.books-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const tituloInput = document.getElementById('tituloLivro')?.value.trim();
  const autorInput = document.getElementById('autorLivro')?.value.trim();
  const generoInput = document.getElementById('generoLivro')?.value.trim();
  const anoInput = document.getElementById('anoPublicacao')?.value;

  if (!tituloInput || !autorInput || !generoInput || !anoInput) {
    alert('Preencha todos os campos corretamente!');
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: tituloInput,
        autor: autorInput,
        genero: generoInput,
        ano: anoInput, // <-- agora certo
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

console.log('DADOS ENVIADOS:', {
  titulo: tituloInput,
  autor: autorInput,
  genero: generoInput,
  ano: Number(anoInput) // ou getFullYear()
});