const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Rutas de usuarios
router.get('/', requireRole('supervisor', 'administrador'), userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', requireRole('administrador'), userController.delete);
router.post('/:id/photo', upload.single('photo'), userController.uploadPhoto);

module.exports = router;