const express = require('express');
const savedController = require('../controllers/savedController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/add', authenticateToken, savedController.addSavedRepository);
router.post('/remove', authenticateToken, savedController.removeSavedRepository);
router.get('/list', authenticateToken, savedController.listSavedRepositories);
router.put('/update', authenticateToken, savedController.updateSavedRepository);

module.exports = router;
