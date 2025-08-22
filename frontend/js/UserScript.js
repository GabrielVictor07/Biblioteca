const apiUrl = 'http://localhost:3000/users';

const form = document.querySelector('.login-form'); 

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const taskInput = document.getElementById('cpfInput').value
  const usernameInput = document.getElementById('usernameInput').value;
  const emailInput = document.getElementById('emailInput').value;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cpf: taskInput,
        username: usernameInput,
        email: emailInput,
      }),
    });

    if (!response.ok) {
      throw new Error('A resposta da rede não foi bem-sucedida');
    }

    const user = await response.json();
    form.reset();
    console.log('Success:', user);
    const notificationCard = document.querySelector('.notification-card');
    notificationCard.style.display = 'block';
  } catch (error) {
    console.error('Error:', error);
    alert('Erro ao cadastrar usuário. Tente novamente.');
  }
});

