//no se supo que hacer se consulto con san gugul
//ver si hay una forma mas sensilla y entendible o si no ya valio

const CORREOS_PERMITIDOS = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

/**
 * Calcula el dígito verificador de un RUN chileno (módulo 11).
 * @param {string} cuerpo - RUN sin dígito verificador.
 */
function calcularDigitoVerificador(cuerpo) {
  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const resto = 11 - (suma % 11);
  if (resto === 11) return '0';
  if (resto === 10) return 'K';
  return String(resto);
}

/**
 * Valida un RUN chileno sin puntos ni guion (ej: 19011022K).
 * Reglas: requerido, sin puntos/guion, 7 a 9 caracteres, dígito verificador correcto.
 */
function validarRun(valor) {
  const run = (valor || '').trim().toUpperCase();

  if (!run) {
    return { valido: false, mensaje: 'El RUN es requerido.' };
  }
  if (/[.\-]/.test(run)) {
    return { valido: false, mensaje: 'El RUN no debe llevar puntos ni guion. Ej: 19011022K' };
  }
  if (!/^[0-9]+[0-9K]$/.test(run)) {
    return { valido: false, mensaje: 'El RUN solo puede contener números y, al final, un dígito verificador (0-9 o K).' };
  }
  if (run.length < 7 || run.length > 9) {
    return { valido: false, mensaje: 'El RUN debe tener entre 7 y 9 caracteres.' };
  }

  const cuerpo = run.slice(0, -1);
  const dv = run.slice(-1);
  const dvCalculado = calcularDigitoVerificador(cuerpo);

  if (dv !== dvCalculado) {
    return { valido: false, mensaje: 'El RUN ingresado no es válido (dígito verificador incorrecto).' };
  }

  return { valido: true, mensaje: '' };
}

/**
 * Valida un correo electrónico.
 * @param {string} valor
 * @param {{requerido?: boolean, max?: number}} opciones
 */
function validarCorreo(valor, opciones = {}) {
  const { requerido = true, max = 100 } = opciones;
  const correo = (valor || '').trim();

  if (!correo) {
    return requerido
      ? { valido: false, mensaje: 'El correo es requerido.' }
      : { valido: true, mensaje: '' };
  }
  if (correo.length > max) {
    return { valido: false, mensaje: `El correo no puede superar los ${max} caracteres.` };
  }
  if (!CORREOS_PERMITIDOS.test(correo)) {
    return { valido: false, mensaje: 'Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.' };
  }

  return { valido: true, mensaje: '' };
}

/**
 * Valida una contraseña (por defecto, entre 4 y 10 caracteres).
 */
function validarPassword(valor, opciones = {}) {
  const { min = 4, max = 10 } = opciones;
  const password = valor || '';

  if (!password) {
    return { valido: false, mensaje: 'La contraseña es requerida.' };
  }
  if (password.length < min || password.length > max) {
    return { valido: false, mensaje: `La contraseña debe tener entre ${min} y ${max} caracteres.` };
  }

  return { valido: true, mensaje: '' };
}

/** Valida que la confirmación de contraseña coincida. */
function validarConfirmacionPassword(password, confirmacion) {
  if (!confirmacion) {
    return { valido: false, mensaje: 'Debes confirmar la contraseña.' };
  }
  if (password !== confirmacion) {
    return { valido: false, mensaje: 'Las contraseñas no coinciden.' };
  }
  return { valido: true, mensaje: '' };
}

/**
 * Valida un campo de texto genérico (nombre, apellidos, dirección, comentario...).
 * @param {string} valor
 * @param {{requerido?: boolean, min?: number, max?: number, nombreCampo?: string}} opciones
 */
function validarTexto(valor, opciones = {}) {
  const { requerido = true, min = 0, max = null, nombreCampo = 'Este campo' } = opciones;
  const texto = (valor || '').trim();

  if (!texto) {
    return requerido
      ? { valido: false, mensaje: `${nombreCampo} es requerido.` }
      : { valido: true, mensaje: '' };
  }
  if (min && texto.length < min) {
    return { valido: false, mensaje: `${nombreCampo} debe tener al menos ${min} caracteres.` };
  }
  if (max && texto.length > max) {
    return { valido: false, mensaje: `${nombreCampo} no puede superar los ${max} caracteres.` };
  }

  return { valido: true, mensaje: '' };
}

/** Valida una fecha de nacimiento opcional (no puede ser futura). */
function validarFechaNacimiento(valor) {
  if (!valor) {
    return { valido: true, mensaje: '' };
  }
  const fecha = new Date(valor);
  const hoy = new Date();

  if (isNaN(fecha.getTime())) {
    return { valido: false, mensaje: 'Ingresa una fecha válida.' };
  }
  if (fecha > hoy) {
    return { valido: false, mensaje: 'La fecha de nacimiento no puede ser futura.' };
  }
  return { valido: true, mensaje: '' };
}

// =======================================================
// Helpers de feedback visual (Bootstrap is-invalid / is-valid)
// Requiere un elemento hermano con id="error-<id-del-input>"
// y clase "invalid-feedback" justo después del input/select.
// =======================================================

function mostrarError(input, mensaje) {
  if (!input) return;
  input.classList.add('is-invalid');
  input.classList.remove('is-valid');
  const feedback = document.getElementById(`error-${input.id}`);
  if (feedback) feedback.textContent = mensaje;
}

function mostrarValido(input) {
  if (!input) return;
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  const feedback = document.getElementById(`error-${input.id}`);
  if (feedback) feedback.textContent = '';
}

/**
 * Aplica el resultado de una validación { valido, mensaje } a un input
 * y retorna el booleano `valido` para poder encadenarlo en el submit.
 */
function aplicarResultado(input, resultado) {
  if (resultado.valido) {
    mostrarValido(input);
  } else {
    mostrarError(input, resultado.mensaje);
  }
  return resultado.valido;
}