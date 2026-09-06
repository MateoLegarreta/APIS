# Colección de Insomnia para la demo del TPO

`TPO-Bebidas.json` — 57 requests listos para mandar, en el orden de la demo.

## Importar

Insomnia → **Create / Import** → **File** → elegir `TPO-Bebidas.json`.

La URL sale de la variable de entorno `base_url` (`http://localhost:4002`).
Si cambia el puerto, se toca en un solo lugar: **Environment → Base Environment**.

## Antes de empezar

1. MySQL levantado con la base `ecommerce` cargada.
2. La app corriendo:
   ```
   cd demo
   ./mvnw.cmd spring-boot:run
   ```
3. La base en estado inicial: **25 productos activos, 8 categorías, 3 usuarios, 0 pedidos**.

Usuarios de la demo:

| Rol | Email | Password |
|---|---|---|
| ADMIN | admin@bebidas.com | admin123 |
| BUYER | lucia@mail.com | lucia123 |
| SELLER | bruno@mail.com | bruno123 |

## Cómo está organizada

| Carpeta | Qué muestra |
|---|---|
| **1 - Camino del comprador** | Registro, login, catálogo con los 4 filtros, paginado, carrito completo, checkout y pedidos |
| **2 - Camino del vendedor y del admin** | ABM de producto, descuento, baja lógica y reactivación, ventas del local, ABM de categorías, usuarios |
| **3 - Validaciones y permisos** | Los 18 caminos de error, cada uno con su status y su mensaje |

Cada request lleva **el status esperado en el nombre** (`[200]`, `[404]`, `[403]`…) y una nota
en la descripción con qué mirar en la respuesta.

## El token se maneja solo

No hay que copiar y pegar tokens. Cada request toma el suyo de la respuesta del login
correspondiente:

```
Authorization: Bearer {% response 'body', 'req_buyer_login', '$.access_token', 'no-history' %}
```

Lo mismo con los ids encadenados: el detalle del pedido usa el id que devolvió el checkout,
y los requests del producto usan el id que devolvió el alta.

**Por eso las carpetas 1 y 2 se mandan en orden.** La carpeta 3 se puede mandar en cualquier
orden, salvo el 11 (checkout vacío), que va después del 10 (vaciar el carrito).

## Ojo con estos dos

- **1 · 01 Registro**: se manda **una sola vez**. Si lo repetís da 400 por email duplicado.
  Si lo probaste antes de la demo, cambiale el mail o borrá el usuario de la base.
- Después de una corrida completa la base queda con un pedido y un producto nuevo.
  Para volver al estado inicial hay que restaurar el backup.

## Verificación

Los 57 requests fueron ejecutados en orden contra la app: **57 OK, 0 fallas**.
