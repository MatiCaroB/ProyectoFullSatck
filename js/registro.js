
// Registro de usuario (dios kiera uqe funcione x2)


document.addEventListener('DOMContentLoaded', () => {
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

  // --- Región / Comuna dependientes ---
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

  // --- Validación en tiempo real (al salir del campo) ---
  if (inputRun) {
    inputRun.addEventListener('blur', () => validarCampo(inputRun, validarRun));
  }
  if (inputNombre) {
    inputNombre.addEventListener('blur', () =>
      validarCampo(inputNombre, (v) => validarTexto(v, { max: 50, nombreCampo: 'El nombre' }))
    );
  }
  if (inputApellidos) {
    inputApellidos.addEventListener('blur', () =>
      validarCampo(inputApellidos, (v) => validarTexto(v, { max: 100, nombreCampo: 'Los apellidos' }))
    );
  }
  if (inputCorreo) {
    inputCorreo.addEventListener('blur', () =>
      validarCampo(inputCorreo, (v) => validarCorreo(v, { max: 100 }))
    );
  }
  if (inputPassword) {
    inputPassword.addEventListener('blur', () => validarCampo(inputPassword, (v) => validarPassword(v)));
  }
  if (inputConfirmar) {
    inputConfirmar.addEventListener('blur', () => {
      const resultado = validarConfirmacionPassword(inputPassword.value, inputConfirmar.value);
      aplicarResultado(inputConfirmar, resultado);
    });
  }
  if (inputFechaNacimiento) {
    inputFechaNacimiento.addEventListener('blur', () => validarCampo(inputFechaNacimiento, validarFechaNacimiento));
  }
  if (inputDireccion) {
    inputDireccion.addEventListener('blur', () =>
      validarCampo(inputDireccion, (v) => validarTexto(v, { max: 300, nombreCampo: 'La dirección' }))
    );
  }

  // --- Envío del formulario ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let esValido = true;

    esValido = validarCampo(inputRun, validarRun) && esValido;
    esValido =
      validarCampo(inputNombre, (v) => validarTexto(v, { max: 50, nombreCampo: 'El nombre' })) && esValido;
    esValido =
      validarCampo(inputApellidos, (v) => validarTexto(v, { max: 100, nombreCampo: 'Los apellidos' })) &&
      esValido;
    esValido = validarCampo(inputCorreo, (v) => validarCorreo(v, { max: 100 })) && esValido;
    esValido = validarCampo(inputPassword, (v) => validarPassword(v)) && esValido;

    if (inputConfirmar) {
      const resultadoConfirmar = validarConfirmacionPassword(inputPassword.value, inputConfirmar.value);
      esValido = aplicarResultado(inputConfirmar, resultadoConfirmar) && esValido;
    }

    if (inputFechaNacimiento) {
      esValido = validarCampo(inputFechaNacimiento, validarFechaNacimiento) && esValido;
    }

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

    esValido =
      validarCampo(inputDireccion, (v) => validarTexto(v, { max: 300, nombreCampo: 'La dirección' })) &&
      esValido;

    if (!esValido) return;

    // --- Persistencia en localStorage ---
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
      // El registro público siempre crea un Cliente; los roles Administrador y
      // Vendedor solo se asignan desde la vista administrativa (ver requisitos).
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