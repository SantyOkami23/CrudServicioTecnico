const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

router.get('/', categoriaController.getAll);
router.get('/:id', categoriaController.getById);
router.post('/', requireRole('administrador'), categoriaController.create);
router.put('/:id', requireRole('administrador'), categoriaController.update);

module.exports = router;