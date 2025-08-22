// frontend/js/EmprestimoScript.js
// EmprestimoScript.js - Script to handle loan registration form submission
// This script listens for the form submission, collects the input data,
// and sends it to the backend API to register a new loan.

// Update with your actual API endpoint
const apiUrlUsers = 'http://localhost:3000/users';
const apiUrlBooks = 'http://localhost:3000/books';
const apiUrlLoans = 'http://localhost:3000/loans';

// Get the form and table body elements
// These elements are used to submit the loan form and display the loans in a table
const form = document.getElementById('formEmprestimo');
const tbody = document.querySelector('.table-container tbody');

// -------------------- FUNÇÃO PARA FORMATAR DATAS --------------------
function formatDate(dateString) {
    if (!dateString) return '---';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // caso não seja um ISO válido, mostra como veio
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// -------------------- CADASTRAR EMPRÉSTIMO --------------------
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuarioCPF = parseInt(document.getElementById('idUsuario').value);
    const livroIdInput = parseInt(document.getElementById('idLivro').value);
    const dataEmprestimo = document.getElementById('dataEmprestimo').value;
    const dataDevolucao = document.getElementById('dataDevolucao').value;

    console.log('Data devolução:', dataDevolucao); 

    try {
        // Buscar usuário pelo CPF
        const users = await fetch(apiUrlUsers).then(r => r.json());
        const usuario = users.find(u => u.cpf == usuarioCPF);
        if (!usuario) {
            alert('Usuário não encontrado!');
            return;
        }

        // Buscar livro pelo ID
        const books = await fetch(apiUrlBooks).then(r => r.json());
        const livro = books.find(b => b.id == livroIdInput);
        if (!livro) {
            alert('Livro não encontrado!');
            return;
        }

        // Criar empréstimo
        const emprestimo = await fetch(apiUrlLoans, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: usuario.id,
                bookId: livro.id,
                date: dataEmprestimo,        // data do empréstimo
                returnDate: dataDevolucao,   // data prevista de devolução
                status: 'pendente'
            })
        }).then(r => {
            if (!r.ok) throw new Error('Erro ao cadastrar empréstimo');
            return r.json();
        });

        form.reset();
        addLoanToUI(emprestimo, usuario.username, livro.titulo);
        alert('Empréstimo cadastrado com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao cadastrar o empréstimo.');
    }
});

// -------------------- ADICIONAR EMPRÉSTIMO NA TABELA --------------------

function addLoanToUI(emprestimo, usuarioNome, livroTitulo) {
  const tr = document.createElement('tr');

  // Verifica se está atrasado
  const hoje = new Date();
  let statusClass = '';
  if (emprestimo.status === 'entregue') {
    statusClass = 'status-entregue';
  } else if (emprestimo.returnDate && new Date(emprestimo.returnDate) < hoje) {
    statusClass = 'status-atrasado';
  } else {
    statusClass = 'status-pendente';
  }

  tr.innerHTML = `
    <td class="name-user-tb" ><strong>${usuarioNome || ''}</strong></td>
    <td>${livroTitulo || ''}</td>
    <td>${formatDate(emprestimo.date)}</td>
    <td class="td-returnDate">${formatDate(emprestimo.returnDate)}</td>
    <td class="tdStatus"><span class="status-dot ${statusClass}"></span></td>
    <td class="actions">
      <button class="devolver-button">
            <svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 -960 960 960" width="25px" fill="#ffffffff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
      </button>
      <button class="delete-button">
        <svg
    class="trash-svg"
    viewBox="0 -10 64 74"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="trash-can">
      <rect
        x="16"
        y="24"
        width="32"
        height="30"
        rx="3"
        ry="3"
        fill="#e74c3c"
      ></rect>

      <g transform-origin="12 18" id="lid-group">
        <rect
          x="12"
          y="12"
          width="40"
          height="6"
          rx="2"
          ry="2"
          fill="#c0392b"
        ></rect>
        <rect
          x="26"
          y="8"
          width="12"
          height="4"
          rx="2"
          ry="2"
          fill="#c0392b"
        ></rect>
      </g>
    </g>
  </svg>
      </button>
    </td>
  `;

  tbody.appendChild(tr);

  // -------------------- Devolver livro --------------------
  const devolverBtn = tr.querySelector('.devolver-button');
  const statusDot = tr.querySelector('.status-dot');
  const returnDateTd = tr.querySelector('.td-returnDate');

  devolverBtn.addEventListener('click', async () => {
    try {
      const response = await fetch(`${apiUrlLoans}/${emprestimo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnDate: new Date().toISOString() })
      });

      if (!response.ok) throw new Error('Erro ao devolver empréstimo');

      const updatedLoan = await response.json();

      // Atualiza status e data
      emprestimo.status = 'entregue';
      statusDot.classList.remove('status-pendente', 'status-atrasado');
      statusDot.classList.add('status-entregue');
      returnDateTd.textContent = formatDate(updatedLoan.returnDate);
    } catch (err) {
      console.error('Erro ao devolver empréstimo:', err);
      alert('Não foi possível devolver o empréstimo.');
    }
  });


    // Deletar empréstimo
    tr.querySelector('.delete-button').addEventListener('click', async () => {
        try {
            await fetch(`${apiUrlLoans}/${emprestimo.id}`, { method: 'DELETE' });
            tr.remove();
        } catch (err) {
            console.error('Erro ao deletar empréstimo:', err);
            alert('Não foi possível deletar o empréstimo.');
        }
    });
}


// -------------------- CARREGAR EMPRÉSTIMOS EXISTENTES --------------------
async function loadLoans() {
    try {
        const loans = await fetch(apiUrlLoans).then(r => r.json());
        const users = await fetch(apiUrlUsers).then(r => r.json());
        const books = await fetch(apiUrlBooks).then(r => r.json());

        loans.forEach(l => {
            const usuario = users.find(u => u.id === l.userId);
            const livro = books.find(b => b.id === l.bookId);
            addLoanToUI(l, usuario?.username, livro?.titulo);
        });
    } catch (error) {
        console.error('Erro ao carregar empréstimos:', error);
    }
}

loadLoans();

function newEmprestimo() {
    const formContainer = document.querySelector('.form-container');
    formContainer.style.display = 'flex'; // Exibe o formulário
    form.reset(); // Limpa os campos do formulário
}