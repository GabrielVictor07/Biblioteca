// frontend/js/UserScript.js
// UserScript.js - Script to handle user registration form submission
// This script listens for the form submission, collects the input data,
// and sends it to the backend API to register a new user.

// Update with your actual API endpoint
const apiUrl = 'http://localhost:3000/users';

const form = document.querySelector('.login-form'); 

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  // Collect input values
  // These inputs are used to register a new user
  const taskInput = document.getElementById('cpfInput').value
  const usernameInput = document.getElementById('usernameInput').value;
  const emailInput = document.getElementById('emailInput').value;

  try { // Check if all fields are filled
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
    // Check if the response is ok
    // If not, throw an error to be caught in the catch block
    // Parse the JSON response
    // This response contains the user data that was registered
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

