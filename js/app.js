// =======================================================
// Utilidades de productos (localStorage)
// =======================================================

function obtenerProductos() {
  try {
    return JSON.parse(localStorage.getItem('productos')) || [];
  } catch (error) {
    return [];
  }
}

function guardarProductos(productos) {
  localStorage.setItem('productos', JSON.stringify(productos));
}

// =======================================================
// Carrito de compras (localStorage)
// =======================================================

function obtenerCarrito() {
  try {
    return JSON.parse(localStorage.getItem('carrito')) || [];
  } catch (error) {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function agregarAlCarrito(idProducto, cantidad) {
  cantidad = parseInt(cantidad, 10) || 1;
  const carrito = obtenerCarrito();
  const item = carrito.find(i => i.id === idProducto);

  if (item) {
    item.cantidad += cantidad;
  } else {
    carrito.push({ id: idProducto, cantidad });
  }

  guardarCarrito(carrito);
  alert('Producto añadido al carrito.');
}

function actualizarContadorCarrito() {
  const contador = document.getElementById('contadorCarrito');
  if (!contador) return;
  const carrito = obtenerCarrito();
  const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  contador.textContent = totalUnidades;
}

document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);

// =======================================================
// Formulario: Agregar producto (productoagregar.html)
// =======================================================

const formAgregar = document.getElementById('formContacto');

if (formAgregar && document.getElementById('codigo')) {
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

  let fotoBase64 = '';

  if (inputFoto) {
    inputFoto.addEventListener('change', (event) => {
      const archivo = event.target.files[0];
      if (archivo) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fotoBase64 = e.target.result;
          if (imgVistaPrevia) {
            imgVistaPrevia.src = fotoBase64;
            imgVistaPrevia.classList.remove('d-none');
          }
        };
        reader.readAsDataURL(archivo);
      }
    });
  }

  formAgregar.addEventListener('submit', (e) => {
    e.preventDefault();

    const codigo = inputCodigo.value.trim();
    const producto = inputProducto.value.trim();
    const precio = parseFloat(inputPrecio.value);
    const marca = inputMarca ? inputMarca.value.trim() : '';
    const stock = parseInt(inputStock.value, 10);
    const stockCritico = inputStockCritico.value !== '' ? parseInt(inputStockCritico.value, 10) : null;
    const categoria = inputCategoria.value;
    const descripcion = inputDescripcion ? inputDescripcion.value.trim() : '';

    if (!codigo || codigo.length < 3) {
      alert('El código del producto debe tener al menos 3 caracteres.');
      return;
    }
    if (!producto) {
      alert('El nombre del producto es requerido.');
      return;
    }
    if (isNaN(precio) || precio < 0) {
      alert('Ingresa un precio válido (0 o mayor).');
      return;
    }
    if (isNaN(stock) || stock < 0) {
      alert('Ingresa un stock válido (0 o mayor).');
      return;
    }
    if (!categoria) {
      alert('Selecciona una categoría.');
      return;
    }

    const productos = obtenerProductos();

    const codigoExiste = productos.some(p => p.codigo === codigo);
    if (codigoExiste) {
      alert('Ya existe un producto con ese código.');
      return;
    }

    productos.push({
      id: Date.now().toString(),
      codigo,
      producto,
      precio,
      marca,
      stock,
      stockCritico,
      categoria,
      descripcion,
      foto: fotoBase64
    });

    guardarProductos(productos);

    formAgregar.reset();
    if (imgVistaPrevia) imgVistaPrevia.classList.add('d-none');
    fotoBase64 = '';

    alert('Producto agregado con éxito.');
    window.location.href = 'productomostrar.html';
  });
}

// =======================================================
// Listado de productos (productomostrar.html)
// =======================================================

const contenedorLista = document.getElementById('listaProductos');

if (contenedorLista) {
  renderizarProductos();
}

function renderizarProductos() {
  const productos = obtenerProductos();
  contenedorLista.innerHTML = '';

  if (productos.length === 0) {
    contenedorLista.innerHTML = '<p class="text-light">Aún no hay productos registrados.</p>';
    return;
  }

  productos.forEach((p) => {
    const stockBajo = p.stockCritico !== null && p.stockCritico !== undefined && p.stock <= p.stockCritico;

    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <div class="card h-100 bg-secondary text-light">
        ${p.foto ? `<img src="${p.foto}" class="card-img-top" alt="${p.producto}" style="max-height:200px;object-fit:cover;">` : ''}
        <div class="card-body">
          <h5 class="card-title">${p.producto}</h5>
          <p class="card-text mb-1"><strong>Código:</strong> ${p.codigo}</p>
          <p class="card-text mb-1"><strong>Precio:</strong> $${Number(p.precio).toLocaleString('es-CL')}</p>
          <p class="card-text mb-1"><strong>Stock:</strong> ${p.stock} ${stockBajo ? '<span class="badge bg-danger">Stock crítico</span>' : ''}</p>
          <p class="card-text mb-1"><strong>Categoría:</strong> ${p.categoria || '-'}</p>
          ${p.marca ? `<p class="card-text mb-1"><strong>Marca:</strong> ${p.marca}</p>` : ''}
          ${p.descripcion ? `<p class="card-text">${p.descripcion}</p>` : ''}
        </div>
        <div class="card-footer d-flex gap-2">
          <a href="productoeditar.html?id=${p.id}" class="btn btn-warning btn-sm flex-fill">Editar</a>
          <button class="btn btn-danger btn-sm flex-fill" data-id="${p.id}" onclick="eliminarProducto('${p.id}')">Eliminar</button>
        </div>
      </div>
    `;
    contenedorLista.appendChild(col);
  });
}

function eliminarProducto(id) {
  if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
  const productos = obtenerProductos().filter(p => p.id !== id);
  guardarProductos(productos);
  renderizarProductos();
}

// =======================================================
// Listado público de productos (index.html / vista tienda)
// =======================================================

const contenedorHome = document.getElementById('listaProductosHome');

if (contenedorHome) {
  renderizarProductosPublico();
}

function renderizarProductosPublico() {
  const productos = obtenerProductos();
  contenedorHome.innerHTML = '';

  if (productos.length === 0) {
    contenedorHome.innerHTML = '<p class="text-center">Todavía no hay productos cargados. ¡Vuelve pronto!</p>';
    return;
  }

  productos.forEach((p) => {
    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <a href="detalleProducto.html?id=${p.id}" class="text-decoration-none text-dark">
        <article class="card-producto h-100">
          ${p.foto ? `<img src="${p.foto}" alt="${p.producto}">` : ''}
          <h2>${p.producto}</h2>
          <p>Precio: <b>$${Number(p.precio).toLocaleString('es-CL')}</b></p>
        </article>
      </a>
    `;
    contenedorHome.appendChild(col);
  });
}

// =======================================================
// Catálogo público de productos (productos.html)
// =======================================================

const contenedorCatalogo = document.getElementById('listaProductosCatalogo');

if (contenedorCatalogo) {
  renderizarCatalogo();
}

function renderizarCatalogo() {
  const productos = obtenerProductos();
  contenedorCatalogo.innerHTML = '';

  if (productos.length === 0) {
    contenedorCatalogo.innerHTML = '<p class="text-center">Todavía no hay productos disponibles.</p>';
    return;
  }

  productos.forEach((p) => {
    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <div class="card h-100 bg-secondary text-light">
        <a href="detalleProducto.html?id=${p.id}">
          ${p.foto ? `<img src="${p.foto}" class="card-img-top" alt="${p.producto}" style="max-height:200px;object-fit:cover;">` : ''}
        </a>
        <div class="card-body">
          <h5 class="card-title">
            <a href="detalleProducto.html?id=${p.id}" class="text-light text-decoration-none">${p.producto}</a>
          </h5>
          <p class="card-text mb-1">$${Number(p.precio).toLocaleString('es-CL')}</p>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-sm w-100" onclick="agregarAlCarrito('${p.id}', 1)">Añadir</button>
        </div>
      </div>
    `;
    contenedorCatalogo.appendChild(col);
  });
}

// =======================================================
// Detalle de producto (detalleProducto.html)
// =======================================================

const contenedorDetalle = document.getElementById('detalleProducto');

if (contenedorDetalle) {
  renderizarDetalleProducto();
}

function renderizarDetalleProducto() {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get('id');
  const producto = obtenerProductos().find(p => p.id === idParam);

  if (!producto) {
    contenedorDetalle.innerHTML = `
      <div class="alert alert-warning text-center">
        Producto no encontrado. <a href="productos.html">Volver al catálogo</a>
      </div>
    `;
    return;
  }

  contenedorDetalle.innerHTML = `
    <div class="row g-4">
      <div class="col-md-6">
        ${producto.foto
          ? `<img src="${producto.foto}" alt="${producto.producto}" class="img-fluid rounded">`
          : '<div class="bg-secondary rounded" style="height:300px;"></div>'}
      </div>
      <div class="col-md-6 text-light">
        <h1>${producto.producto}</h1>
        <p class="fs-3 fw-bold">$${Number(producto.precio).toLocaleString('es-CL')}</p>
        <p>${producto.descripcion || 'Sin descripción disponible.'}</p>
        <p><strong>Categoría:</strong> ${producto.categoria || '-'}</p>
        <div class="d-flex align-items-center gap-2 my-3">
          <label for="cantidadDetalle" class="mb-0">Cantidad</label>
          <input type="number" id="cantidadDetalle" min="1" value="1" class="form-control" style="width:80px;">
        </div>
        <button class="btn btn-primary btn-lg" id="btnAgregarDetalle">Añadir al carrito</button>
      </div>
    </div>
  `;

  document.getElementById('btnAgregarDetalle').addEventListener('click', () => {
    const cantidad = document.getElementById('cantidadDetalle').value;
    agregarAlCarrito(producto.id, cantidad);
  });
}