const { autenticar, permitirRoles } = require('./auth');

module.exports = [
  autenticar,
  permitirRoles('administrador', 'superadministrador'),
];
