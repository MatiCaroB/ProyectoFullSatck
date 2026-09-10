document.addEventListener('DOMContentLoaded', () => {
    const formEditar = document.getElementById('formEditar');
    const inputId = document.getElementById('productoId');
    const inputCodigo = document.getElementById('codigo');
    const inputProducto = document.getElementById('producto');
    const inputPrecio = document.getElementById('precio');
    const inputMarca = document.getElementById('marca');
    const inputStock = document.getElementById('stock');
    const inputStockCritico = document.getElementById('stockCritico');
    const inputCategoria = document.getElementById('categoria');
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
                    <a href="productomostrar.html" class="btn btn-primary fw-bold">Volver a Productos</a>
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
                    <a href="productomostrar.html" class="btn btn-primary fw-bold">Volver a Productos</a>
                </div>
            </div>
        `;
        return;
    }

    // Cargar datos actuales
    inputId.value = productoEncontrado.id;
    if (inputCodigo) inputCodigo.value = productoEncontrado.codigo || '';
    inputProducto.value = productoEncontrado.producto || '';
    inputPrecio.value = productoEncontrado.precio || 0;
    if (inputMarca) inputMarca.value = productoEncontrado.marca || '';
    if (inputStock) inputStock.value = productoEncontrado.stock ?? 0;
    if (inputStockCritico) inputStockCritico.value = productoEncontrado.stockCritico ?? '';
    if (inputCategoria) inputCategoria.value = productoEncontrado.categoria || '';
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
                const codigoNuevo = inputCodigo ? inputCodigo.value.trim() : '';
                if (!codigoNuevo || codigoNuevo.length < 3) {
                    alert('El código del producto debe tener al menos 3 caracteres.');
                    return;
                }

                const codigoDuplicado = productos.some((item, idx) => idx !== index && String(item.codigo).toLowerCase() === codigoNuevo.toLowerCase());
                if (codigoDuplicado) {
                    alert('Ya existe otro producto con ese código.');
                    return;
                }

                productos[index].codigo = codigoNuevo;
                productos[index].producto = inputProducto.value.trim();
                productos[index].precio = parseFloat(inputPrecio.value);
                if (inputMarca) productos[index].marca = inputMarca.value.trim();
                if (inputStock) productos[index].stock = parseInt(inputStock.value, 10);
                if (inputStockCritico) {
                    productos[index].stockCritico = inputStockCritico.value !== '' ? parseInt(inputStockCritico.value, 10) : null;
                }
                if (inputCategoria) productos[index].categoria = inputCategoria.value;
                productos[index].descripcion = inputDescripcion.value.trim();

                if (nuevaFotoBase64 !== '') {
                    productos[index].foto = nuevaFotoBase64;
                }

                localStorage.setItem('productos', JSON.stringify(productos));
                alert('¡Producto actualizado con éxito!');
                window.location.href = 'productomostrar.html';
            }
        });
    }
});