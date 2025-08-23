const apiUrl = 'http://localhost:3000/users';
const form = document.querySelector('.login-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const cpfInput = document.getElementById('cpfInput').value;
  const nomeInput = document.getElementById('usernameInput').value;
  const emailInput = document.getElementById('emailInput').value;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: nomeInput,
        email: emailInput,
        cpf: cpfInput,
      }),
    });

    if (!response.ok) throw new Error('Erro na requisição');

    const user = await response.json();
    form.reset();
    console.log('Success:', user);
    alert("CADASTRADO COM SUCESSO")
  } catch (error) {
    console.error('Error:', error);
    alert('Erro ao cadastrar usuário. Tente novamente.');
  }
});
