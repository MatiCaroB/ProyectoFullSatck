/*const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const registerContainer = document.getElementById('register-container');
const loginContainer = document.getElementById('login-container');
const userPanel = document.getElementById('user-panel');
const welcomeMessage = document.getElementById('welcome-message');
const logoutBtn = document.getElementById('logout-btn');
const message = document.getElementById('message');

// Registro de usuarios
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Verificar si el usuario ya existe
  const userExists = users.some(u => u.username === username);
  if (userExists) {
    message.style.color = 'red';
    message.textContent = 'El usuario ya existe. Intenta con otro nombre.';
    return;
  }

  // Guardar nuevo usuario
  users.push({ username, password });
  localStorage.setItem('users', JSON.stringify(users));

  message.style.color = 'green';
  message.textContent = 'Registro exitoso. Ya puedes iniciar sesión.';
  registerForm.reset();
});

// Inicio de sesión
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Validar credenciales
  const validUser = users.find(u => u.username === username && u.password === password);

  if (validUser) {
    localStorage.setItem('activeSession', username);
    renderDashboard(username);
  } else {
    message.style.color = 'red';
    message.textContent = 'Usuario o contraseña incorrectos.';
  }
});

// Renderizar interfaz según estado de sesión
function renderDashboard(username) {
  registerContainer.style.display = 'none';
  loginContainer.style.display = 'none';
  userPanel.style.display = 'block';
  welcomeMessage.textContent = `¡Bienvenido, ${username}!`;
  message.textContent = '';
}

// Cerrar sesión
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('activeSession');
  registerContainer.style.display = 'block';
  loginContainer.style.display = 'block';
  userPanel.style.display = 'none';
  message.style.color = 'black';
  message.textContent = 'Has cerrado sesión.';
  loginForm.reset();
});

// Mantener sesión activa al recargar la página
window.addEventListener('DOMContentLoaded', () => {
  const activeSession = localStorage.getItem('activeSession');
  if (activeSession) {
    renderDashboard(activeSession);
  }
});*/


const formProductos = document.getElementById('formAgregarProducto');
const inputProducto = document.getElementById('nombreProducto');
const inputPrecio = document.getElementById('precioProducto');

formProductos.addEventListener('submit', (e) => {
  e.preventDefault();

  const producto = inputProducto.value.trim();
  const precio = parseFloat(inputPrecio.value.trim());

  if (!producto || isNaN(precio)) {
    alert('Por favor ingresa un nombre y un precio válido.');
    return;
  }

  const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];

  productosGuardados.push({
    nombre: producto,
    precio: precio
  });

  localStorage.setItem('productos', JSON.stringify(productosGuardados));

  formProductos.reset();
  alert('Producto agregado');
});