// Formulario de contacto (contacto.html)

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formContacto');
  if (!form) return;

  const inputNombre = document.getElementById('nombre');
  const inputCorreo = document.getElementById('email');
  const inputComentario = document.getElementById('comentario');
  const alertaContacto = document.getElementById('alertaContacto');

  function ocultarAlerta() {
    if (!alertaContacto) return;
    alertaContacto.classList.add('d-none');
    alertaContacto.classList.remove('alert-success', 'alert-danger');
    alertaContacto.textContent = '';
  }

  function mostrarExito(mensaje) {
    if (!alertaContacto) return;
    alertaContacto.classList.remove('d-none', 'alert-danger');
    alertaContacto.classList.add('alert-success');
    alertaContacto.textContent = mensaje;
  }

  // --- Validación en tiempo real (al salir del campo) ---
  inputNombre.addEventListener('blur', () =>
    aplicarResultado(inputNombre, validarTexto(inputNombre.value, { max: 100, nombreCampo: 'El nombre' }))
  );
  inputCorreo.addEventListener('blur', () =>
    aplicarResultado(inputCorreo, validarCorreo(inputCorreo.value, { requerido: false, max: 100 }))
  );
  inputComentario.addEventListener('blur', () =>
    aplicarResultado(inputComentario, validarTexto(inputComentario.value, { max: 500, nombreCampo: 'El comentario' }))
  );

  // --- Envío del formulario ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    ocultarAlerta();

    let esValido = true;
    esValido =
      aplicarResultado(inputNombre, validarTexto(inputNombre.value, { max: 100, nombreCampo: 'El nombre' })) &&
      esValido;
    esValido =
      aplicarResultado(inputCorreo, validarCorreo(inputCorreo.value, { requerido: false, max: 100 })) &&
      esValido;
    esValido =
      aplicarResultado(inputComentario, validarTexto(inputComentario.value, { max: 500, nombreCampo: 'El comentario' })) &&
      esValido;

    if (!esValido) return;

    // --- Persistencia en localStorage (mensajes internos) ---
    let mensajes = [];
    try {
      mensajes = JSON.parse(localStorage.getItem('mensajes')) || [];
    } catch (error) {
      mensajes = [];
    }

    mensajes.push({
      id: Date.now().toString(),
      nombre: inputNombre.value.trim(),
      correo: inputCorreo.value.trim(),
      comentario: inputComentario.value.trim(),
      fecha: new Date().toISOString()
    });

    localStorage.setItem('mensajes', JSON.stringify(mensajes));

    form.reset();
    [inputNombre, inputCorreo, inputComentario].forEach((el) => {
      el.classList.remove('is-valid', 'is-invalid');
    });

    mostrarExito('¡Gracias por tu mensaje! Te responderemos a la brevedad.');
  });
});
