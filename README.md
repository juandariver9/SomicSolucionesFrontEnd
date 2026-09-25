# KardexOne – Panel web de facturación

Interfaz web para el sistema de facturación e inventario **KardexOne**. Consume la API REST de [SomicSolucionesBackEnd](https://github.com/juandariver9/SomicSolucionesBackEnd) y permite operar el flujo completo desde el navegador.

## Funcionalidades

- **Nueva factura:** selección de cliente y artículos, con cálculo automático del total de venta y de costo.
- **Clientes:** registro y consulta de clientes (NIT) con su cupo y plazo.
- **Artículos:** gestión del catálogo e inventario.
- **Listado de facturas** y sección de **reportes**.
- Barra lateral plegable y diseño adaptable a móviles.

## Tecnologías

- HTML5
- CSS3
- JavaScript (Fetch API, sin frameworks)

## Cómo ejecutarlo

1. Levanta primero el [backend](https://github.com/juandariver9/SomicSolucionesBackEnd) en `http://localhost:8080`.
2. Clona este repositorio:
   ```bash
   git clone https://github.com/juandariver9/SomicSolucionesFrontEnd.git
   ```
3. Abre `project/index.html` con una extensión como Live Server (puerto 5500, que es el que el backend permite por defecto).

Para usar otra URL del backend, define `window.KARDEXONE_API_URL` antes de cargar `main.js`:

```html
<script>window.KARDEXONE_API_URL = 'https://mi-servidor.com/api';</script>
<script src="main.js"></script>
```

## Autor

**Juan David Rivero Romero** · [GitHub](https://github.com/juandariver9) · [LinkedIn](https://co.linkedin.com/in/juandariver9)
