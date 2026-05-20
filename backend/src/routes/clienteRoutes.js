const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

router.get('/', requireRole('tecnico', 'supervisor', 'administrador'), clienteController.getAll);
router.get('/:id', requireRole('tecnico', 'supervisor', 'administrador'), clienteController.getById);
router.post('/', requireRole('supervisor', 'administrador'), clienteController.create);
router.put('/:id', requireRole('supervisor', 'administrador'), clienteController.update);
router.delete('/:id', requireRole('administrador'), clienteController.delete);

module.exports = router;