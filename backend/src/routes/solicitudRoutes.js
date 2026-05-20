const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

router.get('/', solicitudController.getAll);
router.get('/estadisticas', requireRole('supervisor', 'administrador'), solicitudController.getEstadisticas);
router.get('/:id', solicitudController.getById);
router.post('/', solicitudController.create);
router.put('/:id/asignar', requireRole('supervisor', 'administrador'), solicitudController.asignarTecnico);
router.put('/:id/estado', solicitudController.updateEstado);

module.exports = router;