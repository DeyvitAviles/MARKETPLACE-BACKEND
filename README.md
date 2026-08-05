# MarketChat Web + API

Este proyecto contiene:

- **Vue 3**: marketplace web y panel administrativo.
- **Node.js + Express**: API compartida con Flutter.
- **MySQL/MariaDB de XAMPP**: base de datos `marketplace`.
- **Socket.IO**: chat en tiempo real para la aplicación existente.

## Funciones incorporadas

### Web para usuarios

- Registro e inicio de sesión.
- Marketplace con búsqueda y categorías.
- Detalle de producto.
- Publicar, editar y eliminar productos propios.
- Favoritos.
- Conversaciones y mensajes.
- Edición de perfil y cambio de contraseña.

### Administración

- Roles: `usuario`, `administrador` y `superadministrador`.
- Dashboard con estadísticas.
- Gestión de usuarios, estados y roles.
- Gestión de todos los productos.
- Gestión de categorías.
- Consulta de conversaciones.
- Eliminación completa de conversaciones solo para superadministrador.

## 1. Actualizar la base de datos

1. Inicia Apache y MySQL en XAMPP.
2. Entra a phpMyAdmin.
3. Selecciona la base de datos `marketplace`.
4. Haz una copia de seguridad desde **Exportar**.
5. Ejecuta el archivo:

```text
Marketplace-backend/database/migracion_superadministrador.sql
```

El script convierte al usuario con `id = 1` en superadministrador. Cambia ese ID en el SQL si tu cuenta principal tiene otro ID.

## 2. Configurar el backend

Dentro de `Marketplace-backend`, copia `.env.example` como `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=marketplace
DB_CONNECTION_LIMIT=10
JWT_SECRET=coloca-una-clave-larga-y-unica
CORS_ORIGIN=http://54.157.69.153,http://54.157.69.153:5173,http://localhost:5173
```

Después ejecuta:

```bash
cd Marketplace-backend
npm install
npm start
```

## 3. Configurar Vue

El archivo `.env` del proyecto debe contener:

```env
VITE_API_URL=http://54.157.69.153:3000
```

Después ejecuta:

```bash
npm install
npm run dev
```

Abre la dirección que indique Vite, normalmente `http://localhost:5173`.

## Seguridad y compatibilidad

- La web usa token firmado en el encabezado `Authorization`.
- Las nuevas contraseñas se almacenan con `scrypt`.
- Cuando un usuario antiguo inicia sesión con una contraseña en texto simple, el backend la convierte automáticamente al formato seguro.
- Se mantiene compatibilidad con las rutas actuales de Flutter. La siguiente mejora recomendada es hacer que Flutter también envíe el token.
- Cambia obligatoriamente `JWT_SECRET` antes de publicar el sistema.
