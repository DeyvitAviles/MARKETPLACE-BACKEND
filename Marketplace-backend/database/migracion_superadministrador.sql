-- Ejecutar una sola vez en phpMyAdmin sobre la base de datos marketplace.
-- Realiza una copia de seguridad antes de ejecutar.

ALTER TABLE usuarios
  MODIFY COLUMN password VARCHAR(255) NOT NULL;

ALTER TABLE usuarios
  MODIFY COLUMN rol ENUM('usuario','administrador','superadministrador')
  NOT NULL DEFAULT 'usuario';

ALTER TABLE usuarios
  MODIFY COLUMN estado ENUM('activo','inactivo','bloqueado','eliminado')
  NOT NULL DEFAULT 'activo';

UPDATE usuarios
SET rol = 'superadministrador', activo = 1, estado = 'activo'
WHERE id = 1;
