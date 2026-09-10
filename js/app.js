
// Utilidades de productos (localStorage)


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

function inicializarProductosPorDefecto() {
  const productosActuales = obtenerProductos();

  if (productosActuales.length > 0) {
    return;
  }

  const productosDemo = [
    {
      id: 'demo-1',
      codigo: 'M001',
      producto: 'One Piece - Tomo 1',
      precio: 15990,
      marca: 'Shueisha',
      stock: 12,
      stockCritico: 5,
      categoria: 'Manga',
      descripcion: 'Primera edición del clásico manga de Eiichiro Oda.',
      foto: 'images/onepiece.jpg'
    },
    {
      id: 'demo-2',
      codigo: 'F001',
      producto: 'Figura Naruto',
      precio: 24990,
      marca: 'Banpresto',
      stock: 8,
      stockCritico: 3,
      categoria: 'Figura',
      descripcion: 'Figura coleccionable del personaje Naruto Uzumaki.',
      foto: 'images/naruto.jpg'
    },
    {
      id: 'demo-3',
      codigo: 'C001',
      producto: 'Comic Marvel - Spider-Man',
      precio: 12990,
      marca: 'Marvel',
      stock: 10,
      stockCritico: 4,
      categoria: 'Comic',
      descripcion: 'Edición especial de Spider-Man para coleccionistas.',
      foto: 'images/spiderman.jpg'
    }
  ];

  guardarProductos(productosDemo);
}


// Carrito de compras (localStorage)

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

function obtenerProductoPorId(idProducto) {
  const productos = obtenerProductos();
  return productos.find((p) => String(p.id) === String(idProducto));
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

document.addEventListener('DOMContentLoaded', () => {
  inicializarProductosPorDefecto();
  actualizarContadorCarrito();

  const carritoLista = document.getElementById('carritoLista');
  if (carritoLista) {
    renderizarCarrito();
  }
});

function renderizarCarrito() {
  const contenedor = document.getElementById('carritoLista');
  const totalElemento = document.getElementById('carritoTotal');
  const vaciarBoton = document.getElementById('btnVaciarCarrito');
  const botonComprar = document.getElementById('btnComprar');

  if (!contenedor) return;

  const carrito = obtenerCarrito();
  const productos = obtenerProductos();

  if (!carrito.length) {
    contenedor.innerHTML = `
      <div class="carrito-vacio">
        <h3>Tu carrito está vacío</h3>
        <p>Aún no has agregado productos. Explora nuestra colección y encuentra tu próxima compra.</p>
        <a href="productos.html" class="btn btn-warning">Ver productos</a>
      </div>
    `;

    if (totalElemento) totalElemento.textContent = '$0';
    return;
  }

  let totalGeneral = 0;

  contenedor.innerHTML = carrito.map((item) => {
    const producto = productos.find((p) => String(p.id) === String(item.id));
    if (!producto) return '';

    const subtotal = Number(producto.precio) * Number(item.cantidad);
    totalGeneral += subtotal;

    return `
      <div class="carrito-item">
        <div class="carrito-imagen">
          ${producto.foto ? `<img src="${producto.foto}" alt="${producto.producto}">` : '<div class="carrito-sin-imagen">Sin imagen</div>'}
        </div>

        <div class="carrito-info">
          <h3>${producto.producto}</h3>
          <p>${producto.categoria || 'Sin categoría'}</p>
          <p class="precio">$${Number(producto.precio).toLocaleString('es-CL')}</p>
        </div>

        <div class="carrito-controles">
          <div class="cantidad-box">
            <button type="button" class="btn btn-sm btn-outline-light" data-accion-cantidad="resta" data-id="${producto.id}">-</button>
            <span>${item.cantidad}</span>
            <button type="button" class="btn btn-sm btn-outline-light" data-accion-cantidad="suma" data-id="${producto.id}">+</button>
          </div>
          <button type="button" class="btn btn-link text-danger p-0" data-eliminar-item="${producto.id}">Eliminar</button>
        </div>

        <div class="carrito-subtotal">
          <span>Subtotal</span>
          <strong>$${subtotal.toLocaleString('es-CL')}</strong>
        </div>
      </div>
    `;
  }).join('');

  if (totalElemento) totalElemento.textContent = `$${totalGeneral.toLocaleString('es-CL')}`;

  document.querySelectorAll('[data-accion-cantidad]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const id = boton.dataset.id;
      const accion = boton.dataset.accionCantidad;
      const carritoActual = obtenerCarrito();
      const encontrado = carritoActual.find((item) => String(item.id) === String(id));

      if (!encontrado) return;

      if (accion === 'suma') {
        encontrado.cantidad += 1;
      } else {
        encontrado.cantidad -= 1;
      }

      const nuevoCarrito = carritoActual.filter((item) => item.cantidad > 0);
      guardarCarrito(nuevoCarrito);
      renderizarCarrito();
    });
  });

  document.querySelectorAll('[data-eliminar-item]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const id = boton.dataset.eliminarItem;
      const carritoActual = obtenerCarrito().filter((item) => String(item.id) !== String(id));
      guardarCarrito(carritoActual);
      renderizarCarrito();
    });
  });

  if (vaciarBoton) {
    vaciarBoton.onclick = () => {
      guardarCarrito([]);
      renderizarCarrito();
    };
  }

  if (botonComprar) {
    botonComprar.disabled = !carrito.length;
    botonComprar.onclick = () => {
      if (!carrito.length) return;

      const productosCarrito = obtenerCarrito();
      const productosDisponibles = obtenerProductos();
      let total = 0;

      productosCarrito.forEach((item) => {
        const producto = productosDisponibles.find((p) => String(p.id) === String(item.id));
        if (producto) {
          total += Number(producto.precio) * Number(item.cantidad);
        }
      });

      const resumen = productosCarrito.map((item) => {
        const producto = productosDisponibles.find((p) => String(p.id) === String(item.id));
        if (!producto) return '';
        return `- ${producto.producto} x${item.cantidad} = $${(Number(producto.precio) * Number(item.cantidad)).toLocaleString('es-CL')}`;
      }).filter(Boolean).join('\n');

      const confirmar = confirm(
        `Resumen del pedido:\n\n${resumen}\n\nTotal: $${total.toLocaleString('es-CL')}\n\n¿Deseas confirmar la compra?`
      );

      if (!confirmar) return;

      guardarCarrito([]);
      renderizarCarrito();
      alert('¡Compra realizada con éxito! Gracias por tu compra.');
    };
  }
}


// Formulario: Agregar producto (productoagregar.html)


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


// Listado de productos (productomostrar.html)

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


// Listado público de productos (index.html / vista tienda)


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


// Catálogo público de productos (productos.html)


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

// Detalle de producto (detalleProducto.html)


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
      <div class="col-md-6 detalle-producto-info">
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