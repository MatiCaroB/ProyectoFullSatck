//inicio de sesion
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formLogin');
  if (!form) return;

  const inputCorreo = document.getElementById('email');
  const inputPassword = document.getElementById('password');
  const alertaLogin = document.getElementById('alertaLogin');

  function ocultarAlerta() {
    if (!alertaLogin) return;
    alertaLogin.classList.add('d-none');
    alertaLogin.textContent = '';
  }

  inputCorreo.addEventListener('blur', () => {
    aplicarResultado(inputCorreo, validarCorreo(inputCorreo.value, { max: 100 }));
  });
  inputPassword.addEventListener('blur', () => {
    aplicarResultado(inputPassword, validarPassword(inputPassword.value));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    ocultarAlerta();

    let esValido = true;
    esValido = aplicarResultado(inputCorreo, validarCorreo(inputCorreo.value, { max: 100 })) && esValido;
    esValido = aplicarResultado(inputPassword, validarPassword(inputPassword.value)) && esValido;

    if (!esValido) return;

    let usuarios = [];
    try {
      usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    } catch (error) {
      usuarios = [];
    }

    const correoNormalizado = inputCorreo.value.trim().toLowerCase();
    const passwordIngresada = inputPassword.value;

    const adminPorDefecto = {
      id: 'admin-1',
      nombre: 'Administrador',
      correo: 'admin@gmail.com',
      password: 'admin123',
      tipoUsuario: 'Administrador'
    };

    const existeAdmin = usuarios.some((u) => u.correo === adminPorDefecto.correo);
    if (!existeAdmin) {
      usuarios.push(adminPorDefecto);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    const usuario = usuarios.find(
      (u) => u.correo === correoNormalizado && u.password === passwordIngresada
    );

    if (!usuario) {
      if (alertaLogin) {
        alertaLogin.textContent = 'Correo o contraseña incorrectos.';
        alertaLogin.classList.remove('d-none');
      }
      return;
    }

    sessionStorage.setItem(
      'usuarioActivo',
      JSON.stringify({
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        tipoUsuario: usuario.tipoUsuario
      })
    );

    if (usuario.tipoUsuario === 'Administrador' || usuario.tipoUsuario === 'Vendedor') {
      window.location.href = 'Home.html';
    } else {
      window.location.href = 'homeU.html';
    }
  });
});