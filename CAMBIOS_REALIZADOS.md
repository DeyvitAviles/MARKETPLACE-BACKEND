# Cambios realizados

## Marketplace web

- Inicio de sesión y registro.
- Exploración y búsqueda de productos.
- Filtro por categorías.
- Detalle de producto.
- Favoritos compartidos con Flutter.
- Publicación, edición y eliminación de productos propios.
- Conversaciones, mensajes de texto e imágenes.
- Perfil y cambio de contraseña.

## Administración

- Nuevo rol `superadministrador`.
- Dashboard con estadísticas reales.
- Gestión de usuarios, roles, estados y acceso.
- Gestión de cualquier producto.
- Gestión de categorías.
- Consulta de conversaciones y mensajes.
- Eliminación de conversaciones exclusiva para superadministrador.
- Protección para no eliminar al último superadministrador activo.

## Backend

- Token firmado para la web.
- Contraseñas nuevas protegidas con `scrypt`.
- Conversión automática de contraseñas antiguas al iniciar sesión.
- Configuración de MySQL y CORS mediante `.env`.
- Pool de conexiones MySQL.
- Límites de 8 MB para imágenes.
- Compatibilidad conservada con las rutas actuales de Flutter.

## Base de datos

Ejecutar `Marketplace-backend/database/migracion_superadministrador.sql` en phpMyAdmin antes de usar el nuevo panel.
