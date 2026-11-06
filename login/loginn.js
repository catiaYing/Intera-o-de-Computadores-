// Função para mudar de ecrã
function showScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => {
    screen.classList.remove('active');
  });
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
  } else {
    console.error("Ecrã inválido:", screenId);
  }
}

// Login
function handleLogin(event) {
  event.preventDefault(); 
  const email = document.getElementById('login-email').value;
  document.getElementById('mensagem-boas-vindas').innerText = `Bem-vindo(a), ${email}!`;
  document.getElementById('login-formulario').reset();
  
  // Mudar para ecra principal
  showScreen('ecra-principal');
}

// Criar conta
function handleRegister(event) {
  event.preventDefault();
  const nome = document.getElementById('nome-utilizador').value;
  // texto do ecrã de sucesso com o nome da pessoa
  document.getElementById('mensagem-sucesso').innerText = `${nome}, a tua conta foi criada com sucesso`;
  // Muda para o ecrã de sucesso
  showScreen('ecra-sucesso');
  document.getElementById('registo-formulario').reset();
}

// recuperar password
function handleRecovery(event) {
  event.preventDefault();
  const email = document.getElementById('email-recuperacao').value;
  alert(`Enviámos as instruções para ${email}.`);
  showScreen('ecra-login');
  document.getElementById('recuperacao-formulario').reset();
}

