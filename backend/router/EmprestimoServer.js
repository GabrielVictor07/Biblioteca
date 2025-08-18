
//=========================
// EMPRESTIMO SERVER
// =========================
// Importa bibliotecas necessárias
const apiUrl = 'http://localhost:3000/loans';
const form = document.getElementById('formEmprestimo');
const tbody = document.querySelector('.table-container tbody');

//=========================
// FUNÇÕES UTILITÁRIAS
// =========================
// Formata a data para o formato DD/MM/YYYY

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userId = parseInt(document.getElementById('idUsuario').value);
  const bookId = parseInt(document.getElementById('idLivro').value);
  const dataEmprestimo = document.getElementById('dataEmprestimo').value;
  const dataDevolucao = document.getElementById('dataDevolucao').value;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        bookId,
        date: dataEmprestimo,
        returnDate: dataDevolucao,
        status: 'pendente'
      })
    });

    if (!response.ok) throw new Error('Erro ao cadastrar empréstimo');

    const emprestimo = await response.json();
    form.reset();
    addLoanToUI(emprestimo);
    alert('Empréstimo cadastrado com sucesso!');
  } catch (err) {
    console.error(err);
    alert('Erro ao cadastrar empréstimo.');
  }
});

//=========================
// ADICIONAR EMPRÉSTIMO NA TABELA
// =========================
// Adiciona um empréstimo na tabela

function addLoanToUI(loan) {
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${loan.userId}</td>
    <td>${loan.bookId}</td>
    <td>${formatDate(loan.date)}</td>
    <td>${formatDate(loan.returnDate)}</td>
    <td>${loan.status}</td>
  `;

  tbody.appendChild(tr);
}

function formatDate(dateString) {
  if (!dateString) return '--';
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// =========================
// CARREGAR EMPRÉSTIMOS
// =========================
// Carrega todos os empréstimos e os adiciona na tabela

async function loadLoans() {
  try {
    const response = await fetch(apiUrl);
    const loans = await response.json();
    loans.forEach(loan => addLoanToUI(loan));
  } catch (err) {
    console.error('Erro ao carregar empréstimos:', err);
  }
}

// Inicia o carregamento dos empréstimos
loadLoans();
