const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const clienteRoutes = require('./clienteRoutes');
const solicitudRoutes = require('./solicitudRoutes');
const categoriaRoutes = require('./categoriaRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clientes', clienteRoutes);
router.use('/solicitudes', solicitudRoutes);
router.use('/categorias', categoriaRoutes);

module.exports = router;