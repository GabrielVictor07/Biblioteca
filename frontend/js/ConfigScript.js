const apiUrlUsers = 'http://localhost:3000/users';
const apiUrlBooks = 'http://localhost:3000/books';
const apiUrlLoans = 'http://localhost:3000/loans';

  // Seleciona todos os links do aside
  const menuLinks = document.querySelectorAll('aside ul li a');

  // Mapeia os links para as seções correspondentes
  const sections = {
    'Buscar Usuário': document.querySelector('.main-user'),
    'Buscar Livro': document.querySelector('.main-book'),
    'Registro de Emprestimo': document.querySelector('.main-loans'),
    'Sobre': document.querySelector('.main-about')
  };

  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // impede o comportamento padrão do <a>

      // Esconde todas as seções
      Object.values(sections).forEach(section => section.style.display = 'none');

      // Mostra a seção correspondente ao link clicado
      const targetText = link.textContent.trim();
      if(sections[targetText]) {
        sections[targetText].style.display = 'flex';
      }
    });
  });
