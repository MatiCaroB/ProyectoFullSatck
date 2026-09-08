document.addEventListener('DOMContentLoaded', () => {
    const formEditar = document.getElementById('formEditar');
    const inputId = document.getElementById('productoId');
    const inputProducto = document.getElementById('producto');
    const inputPrecio = document.getElementById('precio');
    const inputMarca = document.getElementById('marca');
    const inputDescripcion = document.getElementById('descripcion');
    const inputFoto = document.getElementById('foto');
    const imgVistaPrevia = document.getElementById('vistaPrevia');

    let nuevaFotoBase64 = '';

    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    if (!idParam) {
        document.querySelector('main').innerHTML = `
            <div class="container text-center my-5 text-light">
                <div class="alert alert-warning border-0 shadow">
                    <h2 class="h4 fw-bold">⚠️ Ningún producto seleccionado para editar</h2>
                    <p class="mb-3">Debes seleccionar un producto desde la lista principal para poder modificarlo.</p>
                    <a href="productoagregar.html" class="btn btn-primary fw-bold">Volver a Productos</a>
                </div>
            </div>
        `;
        return;
    }

    let productos = [];
    try {
        productos = JSON.parse(localStorage.getItem('productos')) || [];
    } catch (error) {
        productos = [];
    }

    const productoEncontrado = productos.find(item => String(item.id) === String(idParam));

    if (!productoEncontrado) {
        document.querySelector('main').innerHTML = `
            <div class="container text-center my-5 text-light">
                <div class="alert alert-danger border-0 shadow">
                    <h2 class="h4 fw-bold">❌ Producto no encontrado</h2>
                    <p class="mb-3">El producto con ID <strong>${idParam}</strong> no existe o fue eliminado.</p>
                    <a href="productoagregar.html" class="btn btn-primary fw-bold">Volver a Productos</a>
                </div>
            </div>
        `;
        return;
    }

    // Cargar datos actuales
    inputId.value = productoEncontrado.id;
    inputProducto.value = productoEncontrado.producto || '';
    inputPrecio.value = productoEncontrado.precio || 0;
    inputMarca.value = productoEncontrado.marca || '';
    inputDescripcion.value = productoEncontrado.descripcion || '';

    if (productoEncontrado.foto) {
        imgVistaPrevia.src = productoEncontrado.foto;
        imgVistaPrevia.classList.remove('d-none');
    }

    if (inputFoto) {
        inputFoto.addEventListener('change', (event) => {
            const archivo = event.target.files[0];
            if (archivo) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    nuevaFotoBase64 = e.target.result;
                    imgVistaPrevia.src = nuevaFotoBase64;
                    imgVistaPrevia.classList.remove('d-none');
                };
                reader.readAsDataURL(archivo);
            }
        });
    }

    if (formEditar) {
        formEditar.addEventListener('submit', (event) => {
            event.preventDefault();

            const index = productos.findIndex(item => String(item.id) === String(idParam));

            if (index !== -1) {
                productos[index].producto = inputProducto.value;
                productos[index].precio = parseFloat(inputPrecio.value);
                productos[index].marca = inputMarca.value;
                productos[index].descripcion = inputDescripcion.value;

                if (nuevaFotoBase64 !== '') {
                    productos[index].foto = nuevaFotoBase64;
                }

                localStorage.setItem('productos', JSON.stringify(productos));
                alert('¡Producto actualizado con éxito!');
                window.location.href = 'productoagregar.html';
            }
        });
    }
});