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

/*AGREGARPRODUCTO.HTML*/ 
document.addEventListener('DOMContentLoaded', () => {
    const formContacto = document.getElementById('formContacto');
    const inputFoto = document.getElementById('foto');
    const imgVistaPrevia = document.getElementById('vistaPrevia');
    let fotoBase64 = ''; 
    inputFoto.addEventListener('change', (event) => {
        const archivo = event.target.files[0];
        if (archivo) {
            const reader = new FileReader();
            reader.onload = function (e) {
                fotoBase64 = e.target.result;
                imgVistaPrevia.src = fotoBase64;
                imgVistaPrevia.classList.remove('d-none'); 
            };
            reader.readAsDataURL(archivo);
        } else {
            fotoBase64 = '';
            imgVistaPrevia.src = '';
            imgVistaPrevia.classList.add('d-none');
        }
    });
    formContacto.addEventListener('submit', (event) => {
        event.preventDefault(); 
        const nuevoProducto = {
            id: Date.now(),
            producto: document.getElementById('producto').value,
            precio: parseFloat(document.getElementById('precio').value),
            marca: document.getElementById('marca').value,
            descripcion: document.getElementById('descripcion').value,
            foto: fotoBase64 
        };
        const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
        productosGuardados.push(nuevoProducto);
        localStorage.setItem('productos', JSON.stringify(productosGuardados));
        alert('¡Producto guardado exitosamente en LocalStorage!');
        formContacto.reset();
        fotoBase64 = '';
        imgVistaPrevia.src = '';
        imgVistaPrevia.classList.add('d-none');
    });
});
/*PRODUCTOMOSTRAR.HTML */
document.addEventListener('DOMContentLoaded', () => {
    const formContacto = document.getElementById('formContacto');
    const inputFoto = document.getElementById('foto');
    const imgVistaPrevia = document.getElementById('vistaPrevia');
    const contenedorLista = document.getElementById('listaProductos');
    let fotoBase64 = '';
    mostrarProductos();
    inputFoto.addEventListener('change', (event) => {
        const archivo = event.target.files[0];
        if (archivo) {
            const reader = new FileReader();
            reader.onload = function (e) {
                fotoBase64 = e.target.result;
                imgVistaPrevia.src = fotoBase64;
                imgVistaPrevia.classList.remove('d-none');
            };
            reader.readAsDataURL(archivo);
        } else {
            fotoBase64 = '';
            imgVistaPrevia.src = '';
            imgVistaPrevia.classList.add('d-none');
        }
    });
    formContacto.addEventListener('submit', (event) => {
        event.preventDefault();
        const nuevoProducto = {
            id: Date.now(),
            producto: document.getElementById('producto').value,
            precio: parseFloat(document.getElementById('precio').value),
            marca: document.getElementById('marca').value,
            descripcion: document.getElementById('descripcion').value,
            foto: fotoBase64
        };
        const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
        productosGuardados.push(nuevoProducto);
        localStorage.setItem('productos', JSON.stringify(productosGuardados));
        alert('¡Producto guardado exitosamente!');
        formContacto.reset();
        fotoBase64 = '';
        imgVistaPrevia.src = '';
        imgVistaPrevia.classList.add('d-none');
        
        mostrarProductos();
    });
    function mostrarProductos() {
        const productos = JSON.parse(localStorage.getItem('productos')) || [];
        contenedorLista.innerHTML = ''; 
        if (productos.length === 0) {
            contenedorLista.innerHTML = '<p class="text-light col-12">No hay productos guardados aún.</p>';
            return;
        }
        productos.forEach((item) => {
            const col = document.createElement('div');
            col.className = 'col';
            col.innerHTML = `
                <div class="card h-100 bg-dark text-light border-secondary shadow-sm">
                    <img src="${item.foto}" class="card-img-top" alt="${item.producto}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <span class="badge bg-primary mb-2">${item.marca}</span>
                        <h5 class="card-title">${item.producto}</h5>
                        <p class="card-text text-truncate">${item.descripcion}</p>
                        <p class="card-text fw-bold fs-5 text-success">$${item.precio.toFixed(2)}</p>
                    </div>
                    <div class="card-footer border-secondary d-flex justify-content-between">
                        <a href="productoeditar.html?id=${item.id}" class="btn btn-warning btn-sm fw-bold">Editar</a>
                        <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${item.id})">Eliminar</button>
                    </div>
                </div>
            `;
            contenedorLista.appendChild(col);
        });
    }
});
function eliminarProducto(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        let productos = JSON.parse(localStorage.getItem('productos')) || [];
        productos = productos.filter(p => p.id !== id);
        localStorage.setItem('productos', JSON.stringify(productos));
        location.reload(); 
    }
}

