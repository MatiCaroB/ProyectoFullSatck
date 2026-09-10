
// Registro de usuario (dios kiera uqe funcione x2)


document.addEventListener('DOMContentLoaded', () => {
  const adminForm = document.getElementById('formAdminUsuario');
  if (adminForm) {
    const tablaUsuarios = document.getElementById('listaUsuariosAdmin');
    const inputId = document.getElementById('usuarioId');
    const inputNombre = document.getElementById('adminNombre');
    const inputApellidos = document.getElementById('adminApellidos');
    const inputRun = document.getElementById('adminRun');
    const inputCorreo = document.getElementById('adminCorreo');
    const inputPassword = document.getElementById('adminPassword');
    const inputTipo = document.getElementById('adminTipoUsuario');
    const botonCancelar = document.getElementById('btnCancelarEdicion');

    function obtenerUsuarios() {
      try {
        return JSON.parse(localStorage.getItem('usuarios')) || [];
      } catch (error) {
        return [];
      }
    }

    function guardarUsuarios(usuarios) {
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    function renderizarUsuariosAdmin() {
      const usuarios = obtenerUsuarios();
      if (!tablaUsuarios) return;

      if (usuarios.length === 0) {
        tablaUsuarios.innerHTML = '<tr><td colspan="4" class="text-center text-secondary">No hay usuarios registrados.</td></tr>';
        return;
      }

      tablaUsuarios.innerHTML = usuarios.map((usuario) => `
        <tr>
          <td>${usuario.nombre || ''} ${usuario.apellidos || ''}</td>
          <td>${usuario.correo || ''}</td>
          <td><span class="badge bg-secondary">${usuario.tipoUsuario || 'Cliente'}</span></td>
          <td>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-sm btn-warning editar-usuario" data-id="${usuario.id}">Editar</button>
              <button type="button" class="btn btn-sm btn-danger eliminar-usuario" data-id="${usuario.id}">Eliminar</button>
            </div>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('.editar-usuario').forEach((boton) => {
        boton.addEventListener('click', () => {
          const usuario = usuarios.find((u) => u.id === boton.dataset.id);
          if (!usuario) return;

          if (inputId) inputId.value = usuario.id;
          if (inputNombre) inputNombre.value = usuario.nombre || '';
          if (inputApellidos) inputApellidos.value = usuario.apellidos || '';
          if (inputRun) inputRun.value = usuario.run || '';
          if (inputCorreo) inputCorreo.value = usuario.correo || '';
          if (inputPassword) inputPassword.value = usuario.password || '';
          if (inputTipo) inputTipo.value = usuario.tipoUsuario || 'Cliente';
          if (botonCancelar) botonCancelar.classList.remove('d-none');
          if (inputNombre) inputNombre.focus();
        });
      });

      document.querySelectorAll('.eliminar-usuario').forEach((boton) => {
        boton.addEventListener('click', () => {
          const id = boton.dataset.id;
          if (!confirm('¿Deseas eliminar este usuario?')) return;

          const usuariosActualizados = obtenerUsuarios().filter((u) => u.id !== id);
          guardarUsuarios(usuariosActualizados);
          renderizarUsuariosAdmin();
        });
      });
    }

    adminForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const usuarios = obtenerUsuarios();
      const id = inputId ? inputId.value : '';
      const nombre = inputNombre.value.trim();
      const apellidos = inputApellidos.value.trim();
      const run = (inputRun.value || '').trim().toUpperCase();
      const correo = (inputCorreo.value || '').trim().toLowerCase();
      const password = inputPassword.value;
      const tipoUsuario = inputTipo ? inputTipo.value : 'Cliente';

      if (!nombre || !apellidos || !run || !correo || !password) {
        alert('Completa todos los campos del usuario.');
        return;
      }

      if (usuarios.some((u) => u.id !== id && u.run === run)) {
        alert('Ya existe un usuario con ese RUN.');
        return;
      }

      if (usuarios.some((u) => u.id !== id && u.correo === correo)) {
        alert('Ya existe un usuario con ese correo.');
        return;
      }

      if (id) {
        const index = usuarios.findIndex((u) => u.id === id);
        if (index >= 0) {
          usuarios[index] = { ...usuarios[index], nombre, apellidos, run, correo, password, tipoUsuario };
        }
      } else {
        usuarios.push({
          id: Date.now().toString(),
          nombre,
          apellidos,
          run,
          correo,
          password,
          tipoUsuario,
          fechaNacimiento: '',
          region: '',
          comuna: '',
          direccion: ''
        });
      }

      guardarUsuarios(usuarios);
      adminForm.reset();
      if (inputId) inputId.value = '';
      if (botonCancelar) botonCancelar.classList.add('d-none');
      renderizarUsuariosAdmin();
      alert('Usuario guardado correctamente.');
    });

    if (botonCancelar) {
      botonCancelar.addEventListener('click', () => {
        adminForm.reset();
        if (inputId) inputId.value = '';
        botonCancelar.classList.add('d-none');
      });
    }

    renderizarUsuariosAdmin();
    return;
  }

  const form = document.getElementById('formUsuario');
  if (!form) return;

  const inputRun = document.getElementById('run');
  const inputNombre = document.getElementById('nombre');
  const inputApellidos = document.getElementById('apellidos');
  const inputCorreo = document.getElementById('email');
  const inputPassword = document.getElementById('password');
  const inputConfirmar = document.getElementById('confirmarPassword');
  const inputFechaNacimiento = document.getElementById('fechaNacimiento');
  const selectRegion = document.getElementById('region');
  const selectComuna = document.getElementById('comuna');
  const inputDireccion = document.getElementById('direccion');

  if (selectRegion) {
    poblarSelectRegiones(selectRegion);
    if (selectComuna) selectComuna.disabled = true;

    selectRegion.addEventListener('change', () => {
      poblarSelectComunas(selectComuna, selectRegion.value);
      mostrarValido(selectRegion);
    });
  }

  function validarCampo(input, validarFn) {
    if (!input) return true;
    const resultado = validarFn(input.value);
    return aplicarResultado(input, resultado);
  }

  if (inputRun) inputRun.addEventListener('blur', () => validarCampo(inputRun, validarRun));
  if (inputNombre) inputNombre.addEventListener('blur', () => validarCampo(inputNombre, (v) => validarTexto(v, { max: 50, nombreCampo: 'El nombre' })));
  if (inputApellidos) inputApellidos.addEventListener('blur', () => validarCampo(inputApellidos, (v) => validarTexto(v, { max: 100, nombreCampo: 'Los apellidos' })));
  if (inputCorreo) inputCorreo.addEventListener('blur', () => validarCampo(inputCorreo, (v) => validarCorreo(v, { max: 100 })));
  if (inputPassword) inputPassword.addEventListener('blur', () => validarCampo(inputPassword, (v) => validarPassword(v)));
  if (inputConfirmar) {
    inputConfirmar.addEventListener('blur', () => {
      const resultado = validarConfirmacionPassword(inputPassword.value, inputConfirmar.value);
      aplicarResultado(inputConfirmar, resultado);
    });
  }
  if (inputFechaNacimiento) inputFechaNacimiento.addEventListener('blur', () => validarCampo(inputFechaNacimiento, validarFechaNacimiento));
  if (inputDireccion) inputDireccion.addEventListener('blur', () => validarCampo(inputDireccion, (v) => validarTexto(v, { max: 300, nombreCampo: 'La dirección' })));

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let esValido = true;
    esValido = validarCampo(inputRun, validarRun) && esValido;
    esValido = validarCampo(inputNombre, (v) => validarTexto(v, { max: 50, nombreCampo: 'El nombre' })) && esValido;
    esValido = validarCampo(inputApellidos, (v) => validarTexto(v, { max: 100, nombreCampo: 'Los apellidos' })) && esValido;
    esValido = validarCampo(inputCorreo, (v) => validarCorreo(v, { max: 100 })) && esValido;
    esValido = validarCampo(inputPassword, (v) => validarPassword(v)) && esValido;

    if (inputConfirmar) {
      const resultadoConfirmar = validarConfirmacionPassword(inputPassword.value, inputConfirmar.value);
      esValido = aplicarResultado(inputConfirmar, resultadoConfirmar) && esValido;
    }

    if (inputFechaNacimiento) esValido = validarCampo(inputFechaNacimiento, validarFechaNacimiento) && esValido;

    if (selectRegion) {
      const regionValida = !!selectRegion.value;
      if (!regionValida) mostrarError(selectRegion, 'Selecciona una región.');
      else mostrarValido(selectRegion);
      esValido = regionValida && esValido;
    }

    if (selectComuna) {
      const comunaValida = !!selectComuna.value;
      if (!comunaValida) mostrarError(selectComuna, 'Selecciona una comuna.');
      else mostrarValido(selectComuna);
      esValido = comunaValida && esValido;
    }

    esValido = validarCampo(inputDireccion, (v) => validarTexto(v, { max: 300, nombreCampo: 'La dirección' })) && esValido;

    if (!esValido) return;

    let usuarios = [];
    try {
      usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    } catch (error) {
      usuarios = [];
    }

    const runNormalizado = inputRun.value.trim().toUpperCase();
    const correoNormalizado = inputCorreo.value.trim().toLowerCase();

    if (usuarios.some((u) => u.run === runNormalizado)) {
      mostrarError(inputRun, 'Ya existe un usuario registrado con ese RUN.');
      return;
    }
    if (usuarios.some((u) => u.correo === correoNormalizado)) {
      mostrarError(inputCorreo, 'Ya existe un usuario registrado con ese correo.');
      return;
    }

    usuarios.push({
      id: Date.now().toString(),
      run: runNormalizado,
      nombre: inputNombre.value.trim(),
      apellidos: inputApellidos.value.trim(),
      correo: correoNormalizado,
      password: inputPassword.value,
      fechaNacimiento: inputFechaNacimiento ? inputFechaNacimiento.value : '',
      tipoUsuario: 'Cliente',
      region: selectRegion ? selectRegion.value : '',
      comuna: selectComuna ? selectComuna.value : '',
      direccion: inputDireccion ? inputDireccion.value.trim() : ''
    });

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
    window.location.href = 'login.html';
  });
});