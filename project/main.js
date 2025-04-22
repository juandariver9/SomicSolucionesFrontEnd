// Sidebar Toggle
let selectedNitId = null;
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');

function toggleSidebar() {
    const isExpanded = sidebar.getAttribute('data-expanded') === 'true';
    sidebar.setAttribute('data-expanded', !isExpanded);
}


sidebarToggle.addEventListener('click', toggleSidebar);
mobileMenuToggle.addEventListener('click', () => {
    sidebar.setAttribute('data-expanded', 'true');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        const isClickInside = sidebar.contains(e.target) || 
                            mobileMenuToggle.contains(e.target);
        
        if (!isClickInside && sidebar.getAttribute('data-expanded') === 'true') {
            sidebar.setAttribute('data-expanded', 'false');
        }
    }
});

// Set current date in invoice date field
document.getElementById('invoiceDate').value = new Date().toLocaleDateString();

// Navigation Active State
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });
        e.currentTarget.classList.add('active');
    });
});

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Client search modal
document.getElementById('searchClient').addEventListener('click', () => {
    openModal('clientModal');
});

// Article search modal
document.getElementById('searchArticle').addEventListener('click', () => {
    openModal('articleModal');
});

// Close modals
document.querySelectorAll('.modal-close').forEach(button => {
    button.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        modal.classList.remove('active');
    });
});

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Articles management
let articles = [];

function addArticle() {
    const articleData = {
        articuloId: null,
        articuloCodigo: document.getElementById('articleCode').value,
        articuloNombre: document.getElementById('articleName').value,
        articuloLaboratorio: document.getElementById('laboratory').value,
        articuloPrecioVenta: parseFloat(document.getElementById('salePrice').value),
        articuloSaldo: parseInt(document.getElementById('balance').value),
        articuloCosto: parseFloat(document.getElementById('costs').value),
        naturaleza: document.getElementById('nature').value,
        Unidades: parseInt(document.getElementById('units').value),
        TotalVenta: parseFloat(document.getElementById('totalSale').value),
        TotalCosto: parseFloat(document.getElementById('totalCosts').value)
    };

    if (!articleData.articuloCodigo || !articleData.Unidades || !articleData.articuloPrecioVenta) {
        alert('Por favor complete todos los campos requeridos del artículo');
        return;
    }

    articles.push(articleData);
    console.log(articles); // <-- verifica aquí el resultado
    updateArticlesTable();
    clearArticleForm();
}





function removeArticle(index) {
    articles.splice(index, 1);
    updateArticlesTable();
}

function updateArticlesTable() {
    const tbody = document.getElementById('articlesTableBody');
    tbody.innerHTML = '';  // Limpiar la tabla antes de agregar los artículos

    // Recorre todos los artículos y los agrega usando la función agregarArticuloATabla
    articles.forEach((article, index) => {
        agregarArticuloATabla(article);
    });
}

function agregarArticuloATabla(articuloAPI) {
    const tbody = document.getElementById('articlesTableBody');

    // Crear la fila y asignar el ID del artículo como atributo personalizado
    const row = document.createElement('tr');
    row.setAttribute('data-article-id', articuloAPI.articuloId);

    // Crear y llenar las celdas de la fila
    row.innerHTML = `
        <td>${articuloAPI.articuloCodigo}</td>
        <td>${articuloAPI.articuloNombre}</td>
        <td>${articuloAPI.articuloLaboratorio}</td>
        <td>${articuloAPI.naturaleza}</td>
        <td>${articuloAPI.articuloSaldo - articuloAPI.Unidades }</td>
        <td>${articuloAPI.Unidades}</td>
        <td>$${articuloAPI.articuloCosto.toFixed(2)}</td>
        <td>$${articuloAPI.articuloPrecioVenta.toFixed(2)}</td>
        <td>$${articuloAPI.TotalVenta.toFixed(2)}</td>
        <td>$${articuloAPI.TotalCosto.toFixed(2)}</td>
        <td>
            <button class="btn-icon" onclick="removeArticle(${articuloAPI.articuloId})">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;

    // Agregar la fila al cuerpo de la tabla
    tbody.appendChild(row);
}




function clearArticleForm() {
    const fields = [
        'articleCode', 'articleName', 'laboratory', 'balance',
        'units', 'costs', 'salePrice', 'totalSale', 'totalCosts'
    ];
    
    fields.forEach(field => {
        document.getElementById(field).value = '';
    });
    
}

// Calculate totals when units or prices change
function calculateTotals() {
    const units = parseFloat(document.getElementById('units').value) || 0;
    const salePrice = parseFloat(document.getElementById('salePrice').value) || 0;
    const costs = parseFloat(document.getElementById('costs').value) || 0;

    document.getElementById('totalSale').value = (units * salePrice).toFixed(2);
    document.getElementById('totalCosts').value = (units * costs).toFixed(2);
}

// Add event listeners for calculation
['units', 'salePrice', 'costs'].forEach(field => {
    document.getElementById(field).addEventListener('input', calculateTotals);
});

// Add article button
document.getElementById('addArticle').addEventListener('click', addArticle);
 

// Cancel invoice
document.getElementById('cancelInvoice').addEventListener('click', () => {
    if (confirm('¿Está seguro de cancelar la factura? Se perderán todos los datos ingresados.')) {
        document.getElementById('invoiceForm').reset();
        document.getElementById('invoiceDate').value = new Date().toLocaleDateString();
        articles = [];
        updateArticlesTable();
    }
});

// Search functionality with debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Modal search handlers
document.querySelectorAll('.modal .search-input').forEach(input => {
    input.addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value.toLowerCase();
        console.log('Searching for:', searchTerm);
        // Implement search functionality here
    }, 300));
});
function actualizarFechaVencimiento(plazo) {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + parseInt(plazo)); // Sumar los días del plazo al día actual

    const fechaVencimiento = hoy.toISOString().split('T')[0];
    document.getElementById('dueDate').value = fechaVencimiento;
} 

// Select client from modal
// Seleccionar cliente en el modal
document.querySelectorAll('.select-client').forEach(button => {
    button.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        
        // Obtiene los valores de las celdas de la fila seleccionada
        const nit = row.cells[0].textContent;
        const name = row.cells[1].textContent;
        const documento = row.cells[2].textContent;
        const creditLimit = row.cells[3].textContent;
        const paymentTerm = row.cells[4].textContent;
        
        // Asigna los valores a los campos del formulario
        document.getElementById('clientNit').value = nit;
        document.getElementById('clientName').value = name;
        document.getElementById('documentoName').value = documento;
        document.getElementById('creditLimit').value = creditLimit;
        document.getElementById('paymentTerm').value = paymentTerm;
        document.getElementById('portfolio').value = '$5,000';
        document.getElementById('available').value = '$5,000';

        //  Llamar aquí a la función con el plazo del cliente seleccionado
        actualizarFechaVencimiento(paymentTerm);

        // Cierra el modal
        closeModal('clientModal');
    });
});




// Select article from modal
document.querySelectorAll('.select-article').forEach(button => {
    button.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        const code = row.cells[0].textContent;
        const name = row.cells[1].textContent;
        const laboratory = row.cells[2].textContent;
        const price = parseFloat(row.cells[3].textContent.replace('$', ''));

        document.getElementById('articleCode').value = code;
        document.getElementById('articleName').value = name;
        document.getElementById('laboratory').value = laboratory;
        document.getElementById('salePrice').value = price;
        document.getElementById('costs').value = (price * 0.7).toFixed(2); // Example cost calculation
        document.getElementById('balance').value = '100'; // Example balance

        calculateTotals();
        closeModal('articleModal');
    });
});


// Función para mostrar una sección y ocultar las demás
function mostrarSeccion(idSeccionActiva) {
    const secciones = document.querySelectorAll('.content-section');
    secciones.forEach(seccion => {
        seccion.style.display = 'none';
    });

    const seccionActiva = document.getElementById(idSeccionActiva);
    if (seccionActiva) {
        seccionActiva.style.display = 'block';
    }
}

// ---------------------- NAVEGACIÓN ------------------------------

// Mostrar una sección específica y ocultar las demás
document.addEventListener('DOMContentLoaded',  () => {
    // Mostrar una sección específica y ocultar las demás
    function mostrarSeccion(id) {
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });
        const visibleSection = document.getElementById(id);
        if (visibleSection) visibleSection.style.display = 'block';
    }

    // Asociar eventos a los ítems de la barra lateral
    document.getElementById('nav-registro').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSeccion('section-registro');
    });

    document.getElementById('nav-clientes').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSeccion('section-clientes');
        fetchClients();
    });

    document.getElementById('nav-articulos').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSeccion('section-articulos');
        
    });

    document.getElementById('nav-facturas').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSeccion('section-facturas');
        cargarFacturasDesdeAPI();
    });

    document.getElementById('nav-reportes').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSeccion('section-reportes');
    });
    fetchClients();
    inicializarFactura();
    // Mostrar sección por defecto al cargar la página
    mostrarSeccion('section-registro');
});

// ------------------- FETCHS -------------------
function fetchClients() {
    fetch('http://localhost:8080/api/nit')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            console.log('Clientes recibidos desde la API:', data); 
            updateClientTable(data);
            renderClientsSectionTable(data);
        })
        .catch(error => {
            console.error('Error al cargar los clientes:', error);
        });
}


function updateClientTable(clientes) {
    const tbody = document.querySelector('#clientModal .data-table tbody');
    tbody.innerHTML = ''; // Limpiar contenido anterior por si acaso

    clientes.forEach(cliente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.nitId}</td>
            <td>${cliente.nitNombre}</td>
            <td>${cliente.nitDocumento}</td>
            <td>${cliente.nitCupo}</td>
            <td>${cliente.nitPlazo}</td>
            <td>
                <button class="btn-icon select-client" data-client-id="${cliente.nitId}">
                    <i class="bi bi-check"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Asignar el evento de clic a todos los botones "select-client"
document.querySelector('#clientModal .data-table').addEventListener('click', async (e) => {
    // Verificar si se hizo clic en un botón con la clase select-client
    const button = e.target.closest('.select-client');
    if (!button) return;

    // Obtener la fila (tr) más cercana
    const row = button.closest('tr');

    // Obtener datos desde las celdas
    const nitId = button.getAttribute('data-client-id'); // Usamos data-client-id del botón
    const nombre = row.cells[1].textContent;
    const documento = row.cells[2].textContent;
    const cupo = parseFloat(row.cells[3].textContent);
    const plazo = row.cells[4].textContent;

    // Obtener valor de cartera desde API
    let cartera = 0;
    try {
        const response = await fetch("http://localhost:8080/api/cartera");
        const data = await response.json();
        const carteraCliente = data.find(c => c.nit.nitId == nitId);
        if (carteraCliente) {
            cartera = parseFloat(carteraCliente.carteraValor_pendiente);
        }
    } catch (error) {
        console.error("Error al obtener la cartera:", error);
    }

    // Calcular disponible
    const disponible = (cupo - cartera).toFixed(2);

    // Rellenar campos del formulario
    document.getElementById('clientNit').value = nitId;
    document.getElementById('nitIdSeleccionado').value = nitId;
    document.getElementById('clientName').value = nombre;
    document.getElementById('documentoName').value = documento;
    document.getElementById('creditLimit').value = cupo;
    document.getElementById('paymentTerm').value = plazo;
    document.getElementById('portfolio').value = cartera;
    document.getElementById('available').value = disponible;



    // Mostrar todo en consola
    console.log(`Seleccionaste a: ${nombre}`);
    console.log(`Datos:
- nitId: ${nitId}
- nombre: ${nombre}
- documento: ${documento}
- cupo: ${cupo}
- plazo: ${plazo}
- cartera: ${cartera}
- disponible: ${disponible}
    `);

    // Cerrar el modal
    closeModal('clientModal');
});

let articulos = [];
// ------------------------------ ARTICULOS -------------------------------
// Fetch Articles
function fetchArticles() {
    fetch('http://localhost:8080/api/articulo')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            articulos = data; // Guarda los artículos globalmente
            console.log('Artículos recibidos desde la API:', data); 
            updateArticleTable(data);
        })
        .catch(error => {
            console.error('Error al cargar los artículos:', error);
        });
}

// Update Article Table
function updateArticleTable(articulos) {
    const tbody = document.querySelector('#articleModal .data-table tbody');
    tbody.innerHTML = ''; // Limpiar contenido anterior por si acaso

    articulos.forEach(articulo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${articulo.articuloCodigo}</td>
            <td>${articulo.articuloNombre}</td>
            <td>${articulo.articuloLaboratorio}</td>
            <td>${articulo.articuloPrecioVenta}</td>
            <td>
                <button class="btn-icon select-article" data-article-id="${articulo.articuloId}">
                    <i class="bi bi-check"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Asignar el evento de clic a todos los botones "select-article"
document.querySelector('#articleModal .data-table').addEventListener('click', async (e) => {
    // Verificar si se hizo clic en un botón con la clase select-article
    const button = e.target.closest('.select-article');
    if (!button) return;

    // Obtener la fila (tr) más cercana
    const row = button.closest('tr');

    // Obtener datos desde las celdas
    const articuloId = button.getAttribute('data-article-id');
    const codigo = row.cells[0].textContent;
    const nombre = row.cells[1].textContent;
    const laboratorio = row.cells[2].textContent;
    const precioVenta = parseFloat(row.cells[3].textContent);
    
    // Realizamos la llamada a la API para obtener los datos del artículo completo, incluyendo saldo y costo
    const response = await fetch(`http://localhost:8080/api/articulo/${articuloId}`);

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
        console.error("Error al obtener el artículo");
        return;
    }

    // Obtener los datos del artículo desde la API
    const articuloAPI = await response.json();

    // Rellenar el objeto de artículo con los datos dinámicos de la API
    const articulo = {
        articuloCodigo: codigo,
        articuloNombre: nombre,
        articuloLaboratorio: laboratorio,
        articuloSaldo: articuloAPI.articuloSaldo,  // Valor dinámico de saldo
        articuloCosto: articuloAPI.articuloCosto,  // Valor dinámico de costo
        articuloPrecioVenta: precioVenta
    };

    // Rellenar campos del formulario de artículo
    document.getElementById('articleCode').value = articulo.articuloCodigo;
    document.getElementById('articleName').value = articulo.articuloNombre;
    document.getElementById('laboratory').value = articulo.articuloLaboratorio;
    document.getElementById('salePrice').value = articulo.articuloPrecioVenta;
    document.getElementById('balance').value = articulo.articuloSaldo; // Añadir saldo
    document.getElementById('costs').value = articulo.articuloCosto; // Añadir costo

    // Actualizar los totales de venta y costos
    updateArticleTotal(articulo.articuloPrecioVenta);

    // Cerrar el modal de búsqueda de artículo
    closeModal('articleModal');

    // Obtener la fecha actual
    const fechaHoy = new Date();

    // Obtener el ID del cliente (por ejemplo, de un formulario o un valor predefinido)
    const clienteId = 2;  // Asegúrate de que esto sea el cliente correcto

    // Realizar la llamada para obtener los datos del NIT, que incluyen el plazo
    const nitResponse = await fetch(`http://localhost:8080/api/nit/${clienteId}`);

    if (!nitResponse.ok) {
        console.error("Error al obtener el NIT del cliente");
        return;
    }

    const nitData = await nitResponse.json();
    const plazoCliente = nitData.nitPlazo;  // Plazo del cliente desde la API

    // Calcular la fecha de vencimiento, sumando el plazo del cliente (en días)
    const fechaVencimiento = new Date(fechaHoy);
    fechaVencimiento.setDate(fechaVencimiento.getDate() + plazoCliente);  // Sumar el plazo al día actual

    // Crear la estructura de la factura con fechas dinámicas
    const factura = {
        facturaFecha: fechaHoy.toISOString().split('T')[0],  // Formato YYYY-MM-DD
        facturaFechaVencimiento: fechaVencimiento.toISOString().split('T')[0],  // Formato YYYY-MM-DD
        facturaTipo: articulo.articuloLaboratorio,  // Esto es solo un ejemplo, puedes ajustarlo
        facturaTotal: calcularTotalFactura(),  // Total calculado de la factura
        nit: {
            nitId: clienteId  // Este es el NIT
        }
    };
    nitSeleccionadoId = clienteId
    // Mostrar todos los datos de la factura en un solo console.log
    console.log(`Datos de la factura:
- Factura Fecha: ${factura.facturaFecha}
- Factura Fecha Vencimiento: ${factura.facturaFechaVencimiento}
- Factura Tipo: ${factura.facturaTipo}
- Factura Total: ${factura.facturaTotal}
- NIT ID: ${factura.nit.nitId}
- Artículo Seleccionado:
  - Código: ${articulo.articuloCodigo}
  - Nombre: ${articulo.articuloNombre}
  - Laboratorio: ${articulo.articuloLaboratorio}
  - Precio de Venta: ${articulo.articuloPrecioVenta}
  - Saldo: ${articulo.articuloSaldo}
  - Costo: ${articulo.articuloCosto}`);
})

;





// Actualizar el total de venta y costos al seleccionar un artículo
function updateArticleTotal(precioVenta) {
    const units = parseFloat(document.getElementById('units').value) || 0;
    const totalSale = (units * precioVenta).toFixed(2);
    const totalCosts = (units * parseFloat(document.getElementById('costs').value || 0)).toFixed(2);
    document.getElementById('totalSale').value = totalSale;
    document.getElementById('totalCosts').value = totalCosts;
}


// Buscar artículo cuando se hace clic en el botón de búsqueda
document.getElementById('searchArticle').addEventListener('click', () => {
    fetchArticles(); // Recargar los artículos
    openModal('articleModal'); // Mostrar el modal de búsqueda
});

// Función para abrir el modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
}

// Función para cerrar el modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}


// ------------------------------ FACTURA ---------------------------------

async function inicializarFactura() {
    try {
        // 1. Obtener todas las facturas para calcular el siguiente ID
        const response = await fetch('http://localhost:8080/api/factura');
        const facturas = await response.json();

        // Verificar que se obtienen las facturas correctamente
        console.log('Facturas obtenidas:', facturas);

        // Calcular el siguiente ID de factura
        const ultimoId = facturas.length > 0 
            ? Math.max(...facturas.map(f => f.facturaId)) 
            : 0;
        const siguienteId = ultimoId + 1;

        // 2. Obtener la fecha actual en formato YYYY-MM-DD
        const fechaActual = new Date().toISOString().split('T')[0];

        // Asignar el número de factura (siguienteId) y la fecha actual de inicio
        const numeroFacturaInput = document.getElementById('facturaNumero');
        const fechaInput = document.getElementById('invoiceDate'); // Usar invoiceDate
        numeroFacturaInput.value = siguienteId; // Asignar el número de factura
        fechaInput.value = fechaActual; // Asignar la fecha actual

        console.log(`Número de factura asignado: ${siguienteId}`);
        console.log(`Fecha de factura asignada: ${fechaActual}`);

        // 3. Abrir el modal de búsqueda de cliente y asignar evento al seleccionar un cliente
        const selectClientButtons = document.querySelectorAll('.select-client'); // Seleccionamos todos los botones de seleccionar cliente

        selectClientButtons.forEach(button => {
            button.addEventListener('click', async function() {
                const clienteId = button.getAttribute('data-client-id'); // Obtener el ID del cliente seleccionado
                console.log('Cliente seleccionado:', clienteId);

                try {
                    // 4. Obtener los detalles del cliente desde la API de NIT
                    const nitResponse = await fetch(`http://localhost:8080/api/nit/${clienteId}`);
                    const nit = await nitResponse.json();
                    console.log('Detalles del NIT seleccionado:', nit);
                    
                    // Guardar el nitId seleccionado en un input oculto
                    document.getElementById('nitIdSeleccionado').value = nit.nitId;

                    if (nit && nit.nitPlazo !== undefined) {
                        // Obtener el plazo del cliente (días)
                        const plazo = nit.nitPlazo;
                        console.log('Plazo del cliente:', plazo);

                        // Calcular la fecha de vencimiento sumando el plazo a la fecha actual
                        const hoy = new Date();
                        hoy.setDate(hoy.getDate() + plazo); // Sumar los días del plazo al día actual
                        const fechaVencimiento = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD

                        // Asignar la fecha de vencimiento al campo correspondiente
                        const vencimientoInput = document.getElementById('dueDate'); // Usar dueDate
                        if (vencimientoInput) {
                            vencimientoInput.value = fechaVencimiento; // Asignar la fecha calculada
                            console.log(`Fecha de vencimiento asignada: ${fechaVencimiento}`);
                        } else {
                            console.error('Campo de fecha de vencimiento no encontrado.');
                        }
                    } else {
                        console.error('Plazo del cliente no disponible');
                    }
                } catch (error) {
                    console.error('Error al obtener los detalles del NIT:', error);
                }

                // Cerrar el modal después de seleccionar el cliente (si es necesario)
                const clientModal = document.getElementById('clientModal');
                if (clientModal) {
                    clientModal.style.display = 'none'; // Cerrar el modal manualmente
                }
            });
        });
        
    } catch (error) {
        console.error('Error al inicializar los datos de la factura:', error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    inicializarFactura();
});



// Abre un modal por ID
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';

        // Habilitar cierre al hacer clic fuera del contenido
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modalId);
            }
        });
    }
}

// Cierra un modal por ID
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Agrega eventos a todos los botones con clase 'modal-close'
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
});


// Asignar el evento de clic al botón "Agregar Artículo"
document.getElementById('addArticle').addEventListener('click', () => {
    // Obtener el select con el id 'nature'
    const selectElement = document.getElementById('nature');
    console.log(selectElement);  // Muestra el objeto completo del select

    const facturaTipos = selectElement.value;
    console.log("Tipo de factura: ", facturaTipos);  // Mostrar el valor capturado del select

    // Obtener los datos del NIT
    const nitNombre = document.getElementById('clientName').value;
    const nitDocumento = document.getElementById('documentoName').value;
    const nitCupo = parseFloat(document.getElementById('creditLimit').value) || 0;
    const nitPlazo = parseInt(document.getElementById('paymentTerm').value) || 0;
    const nitCartera = parseFloat(document.getElementById('portfolio').value) || 0;
    const nitDisponible = parseFloat(document.getElementById('available').value) || 0;

    // Obtener los datos de la factura
    const facturaNumero = document.getElementById('facturaNumero').value;
    const facturaFecha = document.getElementById('invoiceDate').value;
    const facturaFechaVencimiento = document.getElementById('dueDate').value;

    // Obtener los datos de los artículos
    const articulos = [];
    console.log("acá está:", articulos)
    const rows = document.querySelectorAll('#articlesTableBody tr');
    rows.forEach(row => {
        // Obtener el ID del artículo, que se asigna dinámicamente (suponiendo que ya está en el HTML)
        const articuloId = row.getAttribute('data-article-id');  // Asegúrate de tener un data-attribute en cada fila con el ID
    
        const articuloCodigo = row.cells[1].textContent; // Smartphone Galaxy X
        const articuloNombre = row.cells[2].textContent; // Samsung
        const articuloLaboratorio = row.cells[3].textContent; // Tipo de factura (COMPRA o VENTA)
        const articuloPrecioVenta = parseFloat(row.cells[4].textContent.replace('$', '').replace(',', '')) || 0; // 450.00
        const articuloSaldo = parseInt(row.cells[5].textContent) || 0; // 150
        const articuloCosto = parseFloat(row.cells[6].textContent.replace('$', '').replace(',', '')) || 0; // 300.00
        
        articulos.push({
            articuloId,           // ID dinámico del artículo (deberías asegurarte de que esté en el HTML)
            articuloCodigo,       // Código del artículo (ART001)
            articuloNombre,       // Nombre del artículo (Smartphone Galaxy X)
            articuloLaboratorio,  // Tipo de factura (COMPRA o VENTA)
            articuloPrecioVenta,  // Precio de venta
            articuloSaldo,        // Unidades disponibles
            articuloCosto         // Costo
        });
    });
        
    // Mostrar los datos de los artículos en consola
    console.log(articulos);

    // Calcular el total de la factura usando la función existente
    const facturaTotal = calcularTotalFactura();

    // Mostrar los datos en la consola de forma organizada
    console.log({
        "Datos de Factura": {
            "Factura Número": facturaNumero,
            "Fecha de Factura": facturaFecha,
            "Fecha de Vencimiento": facturaFechaVencimiento,
            "Tipo de Factura": articulos[0].articuloLaboratorio,  // Tipo de factura obtenido de articuloLaboratorio
            "facturaTotal": facturaTotal,    // Total calculado de la factura
        },
        "Datos de NIT": {
            "Nombre": nitNombre,
            "Documento": nitDocumento,
            "Cupo": nitCupo,
            "Plazo": nitPlazo,
            "Cartera": nitCartera,
            "Disponible": nitDisponible
        },
        "Artículos Agregados": articulos
    });

    // Deshabilitar el select de naturaleza después de agregar un artículo
    document.getElementById('nature').disabled = true;

    // Deshabilitar los campos de NIT y hacerlos ineditables
    document.getElementById('clientName').disabled = true;  // Deshabilitado
    document.getElementById('clientName').readOnly = true;  // Hace el campo ineditable, solo se ve el valor
    document.getElementById('documentoName').disabled = true;
    document.getElementById('creditLimit').disabled = true;
    document.getElementById('paymentTerm').disabled = true;
    document.getElementById('portfolio').disabled = true;
    document.getElementById('available').disabled = true;

    // Hacer el campo de NIT del Cliente ineditable
    document.getElementById('clientNit').disabled = true;  // Deshabilitar NIT
    document.getElementById('clientNit').readOnly = true;  // Asegurar que no sea editable

    // Ocultar el botón de búsqueda
    document.getElementById('searchClient').style.display = 'none';
});

// Evento para cancelar la factura y habilitar el select de naturaleza
document.getElementById('cancelInvoice').addEventListener('click', () => {
    // Habilitar el select de naturaleza
    document.getElementById('nature').disabled = false;

    // Habilitar los campos de NIT nuevamente y permitir escritura
    document.getElementById('clientName').disabled = false;
    document.getElementById('clientName').readOnly = false;  // Permite escribir de nuevo
    document.getElementById('documentoName').disabled = false;
    document.getElementById('creditLimit').disabled = false;
    document.getElementById('paymentTerm').disabled = false;
    document.getElementById('portfolio').disabled = false;
    document.getElementById('available').disabled = false;

    // Habilitar el campo de NIT del Cliente nuevamente
    document.getElementById('clientNit').disabled = false;  // Habilitar NIT
    document.getElementById('clientNit').readOnly = false;  // Permitir que sea editable

    // Mostrar nuevamente el botón de búsqueda
    document.getElementById('searchClient').style.display = 'inline-block';
});



// Función para calcular el total de la factura (ya existente)
function calcularTotalFactura() {
    let total = 0;
    const rows = document.querySelectorAll('#articlesTableBody tr');
    rows.forEach(row => {
        const rawTotalVenta = row.cells[8].textContent.trim();
        const articuloTotalVenta = parseFloat(rawTotalVenta.replace('$', '').replace(',', '')) || 0;
        total += articuloTotalVenta;
    });
    return total;
}



function obtenerArticuloIdPorCodigo(codigo) {
    const articulo = articulos.find(item => item.articuloCodigo === codigo);
    return articulo ? articulo.articuloId : null;  // Devuelve el articuloId si se encuentra, o null si no existe
}


async function guardarFacturaKardexConIdEstimado(facturaId, tipoFactura) {
    try {
        // Esperar a que los artículos se hayan cargado
        if (articulos.length === 0) {
            console.error("No se han cargado los artículos.");
            return; // Si no se han cargado los artículos, salir de la función
        }

        // Iterar sobre la lista de artículos
        for (const articulo of articles) {
            // Verificar si los valores requeridos son correctos
            console.log("Artículo:", articulo);

            // Buscar el articuloId correspondiente al articuloCodigo
            const articuloId = obtenerArticuloIdPorCodigo(articulo.articuloCodigo);
            if (!articuloId) {
                console.error(`No se encontró el articuloId para el código: ${articulo.articuloCodigo}`);
                continue; // Si no se encuentra el articuloId, saltar al siguiente artículo
            }

            // Construir el detalle de la factura con la estructura esperada
            const detalle = {
                factura: {
                    facturaId: facturaId, // ID de la factura
                    facturaTipo: tipoFactura === '+' ? "VENTA" : "COMPRA" // Determina el tipo de factura
                },
                articulo: {
                    articuloId: articuloId, // ID del artículo
                    articuloSaldo: articulo.articuloSaldo // Añadir el saldo del artículo
                },
                fkardexcantidad: articulo.Unidades, // Usar Unidades en lugar de cantidad
                fkardexprecio_unitario: tipoFactura === '+' ? articulo.articuloPrecioVenta : articulo.articuloCosto, // Precio según el tipo de factura
                fkardexsubtotal: articulo.Unidades * (tipoFactura === '+' ? articulo.articuloPrecioVenta : articulo.articuloCosto) // Subtotal
            };

            // Mostrar el detalle en consola antes de enviarlo
            console.log("Detalle a enviar al servidor:", JSON.stringify(detalle, null, 2));

            // Enviar la solicitud POST a la API
            const response = await fetch('http://localhost:8080/api/facturakardex', {
                method: 'POST', // Método POST
                headers: { 
                    'Content-Type': 'application/json' // Indicamos que estamos enviando datos en formato JSON
                },
                body: JSON.stringify(detalle) // El cuerpo de la solicitud es el detalle de la factura, convertido a JSON
            });

            if (!response.ok) {
                throw new Error(`Error al guardar detalle del artículo ${articulo.articuloNombre}`);
            }
        }

        console.log("Todos los detalles guardados exitosamente.");
    } catch (error) {
        console.error("Error al guardar los detalles de la factura:", error);
    }
}





// -------------------------------------------------- CLIENTES ----------------------------------
function renderClientsSectionTable(clientes) {
    const tbody = document.getElementById('clientsTableBody');
    tbody.innerHTML = '';

    clientes.forEach(cliente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.nitNombre}</td>
            <td>${cliente.nitDocumento}</td>
            <td>${cliente.nitCupo}</td>
            <td>${cliente.nitPlazo}</td>
            <td>
                <button class="btn-icon delete-client" data-client-id="${cliente.nitId}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('clientCount').textContent = `${clientes.length} cliente(s) en total`;
}

document.getElementById('clientForm').addEventListener('submit', function(e) {
    e.preventDefault();  // Evitar que se recargue la página

    // Capturar los valores del formulario
    const nitNombre = document.getElementById('nitNombre').value;
    const nitDocumento = document.getElementById('nitDocumento').value;
    const nitCupo = parseFloat(document.getElementById('nitCupo').value);
    const nitPlazo = parseInt(document.getElementById('nitPlazo').value);

    // Validar los campos antes de enviar
    if (!nitNombre || !nitDocumento || isNaN(nitCupo) || isNaN(nitPlazo)) {
        alert('Por favor, complete todos los campos correctamente.');
        return;
    }

    const cliente = {
        nitNombre,
        nitDocumento,
        nitCupo,
        nitPlazo
    };

    const url = 'http://localhost:8080/api/nit';
    const method = 'POST';

    console.log('Cliente a enviar:', cliente);
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar el cliente');
        }
        return response.json();
    })
    .then(data => {
        fetchClients();
        alert('Cliente registrado exitosamente');
        document.getElementById('clientForm').reset();
    })
    .catch(error => {
        console.error('Error al guardar el cliente:', error);
        alert('Ocurrió un error al guardar el cliente');
    });
});

document.querySelector('#clientsTableBody').addEventListener('click', async (e) => {
    const deleteButton = e.target.closest('.delete-client');
    if (!deleteButton) return;

    const nitId = deleteButton.getAttribute('data-client-id');
    const confirmDelete = confirm(`¿Estás seguro de eliminar el cliente con ID ${nitId}?`);
    if (!confirmDelete) return;

    try {
        const response = await fetch(`http://localhost:8080/api/nit/${nitId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar el cliente');

        console.log(`Cliente con ID ${nitId} eliminado correctamente.`);
        fetchClients(); // Recargar la tabla con los datos actualizados

    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
    }
});

/*------------------------------------------ARTICULOS --------------------------------------------- */

// Obtener y renderizar artículos
function cargarArticulosDesdeAPI() {
    fetch('http://localhost:8080/api/articulo')
        .then(response => {
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            return response.json();
        })
        .then(data => {
            listaArticulos = data; // variable global para uso interno
            console.log('Artículos obtenidos:', data);
            pintarTablaArticulos(data);
        })
        .catch(error => {
            console.error('Error al obtener los artículos:', error);
        });
}

// Pintar artículos en la tabla
function pintarTablaArticulos(articulos) {
    const cuerpoTabla = document.getElementById('mainArticlesTableBody');
    cuerpoTabla.innerHTML = '';

    articulos.forEach(item => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${item.articuloCodigo}</td>
            <td>${item.articuloNombre}</td>
            <td>${item.articuloLaboratorio}</td>
            <td>${item.articuloSaldo}</td>
            <td>${item.articuloCosto}</td>
            <td>${item.articuloPrecioVenta}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger eliminar-articulo" data-id="${item.articuloId}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });

    document.getElementById('articleCount').textContent = `${articulos.length} artículo(s) en total`;
}

// Manejar formulario de creación
document.getElementById('articleForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const articulo = {
        articuloCodigo: document.getElementById('articuloCodigo').value,
        articuloNombre: document.getElementById('articuloNombre').value,
        articuloLaboratorio: document.getElementById('articuloLaboratorio').value,
        articuloSaldo: parseInt(document.getElementById('articuloSaldo').value),
        articuloCosto: parseFloat(document.getElementById('articuloCosto').value),
        articuloPrecioVenta: parseFloat(document.getElementById('articuloPrecioVenta').value)
    };

    if (!articulo.articuloCodigo || !articulo.articuloNombre || !articulo.articuloLaboratorio ||
        isNaN(articulo.articuloSaldo) || isNaN(articulo.articuloCosto) || isNaN(articulo.articuloPrecioVenta)) {
        alert('Por favor, complete todos los campos correctamente.');
        return;
    }

    fetch('http://localhost:8080/api/articulo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articulo)
    })
    .then(res => {
        if (!res.ok) throw new Error('Error al guardar el artículo');
        return res.json();
    })
    .then(() => {
        alert('Artículo registrado correctamente');
        document.getElementById('articleForm').reset();
        cargarArticulosDesdeAPI();
    })
    .catch(err => {
        console.error('Error al guardar el artículo:', err);
        alert('Ocurrió un error al registrar el artículo');
    });
});

// Eliminar artículo al hacer clic en botón
document.querySelector('#mainArticlesTableBody').addEventListener('click', async (e) => {
    const botonEliminar = e.target.closest('.eliminar-articulo');
    if (!botonEliminar) return;

    const id = botonEliminar.dataset.id;
    const confirmacion = confirm(`¿Estás seguro de eliminar el artículo con ID ${id}?`);
    if (!confirmacion) return;

    try {
        const respuesta = await fetch(`http://localhost:8080/api/articulo/${id}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) throw new Error('No se pudo eliminar el artículo');

        console.log(`Artículo ${id} eliminado`);
        cargarArticulosDesdeAPI();
    } catch (error) {
        console.error('Error eliminando el artículo:', error);
    }
});

// Cargar artículos al iniciar
document.addEventListener('DOMContentLoaded', cargarArticulosDesdeAPI);


/* ............................... */
// Obtener y renderizar las facturas
function cargarFacturasDesdeAPI() {
    fetch('http://localhost:8080/api/factura')
        .then(response => {
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            return response.json();
        })
        .then(data => {
            console.log('Facturas obtenidas:', data);
            pintarTablaFacturas(data);
        })
        .catch(error => {
            console.error('Error al obtener las facturas:', error);
        });
}

// Pintar las facturas en la tabla
function pintarTablaFacturas(facturas) {
    const cuerpoTabla = document.getElementById('facturasTableBody');
    cuerpoTabla.innerHTML = ''; // Limpiar la tabla antes de agregar los nuevos datos

    facturas.forEach(item => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${item.facturaId}</td>
            <td>${item.nit.nitNombre}</td>
            <td>${item.facturaFecha}</td>
            <td>${item.facturaFechaVencimiento}</td>
            <td>${item.facturaTipo}</td>
            <td>${item.facturaTotal}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger eliminar-factura" data-id="${item.facturaId}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}
