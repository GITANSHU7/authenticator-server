const express = require('express');
const router = express.Router();

const leadController = require('../controller/leadController');
const isAuthenticated = require('../middleware/middleware');

router.post('/create', isAuthenticated, leadController.createLead);
router.post('/list', isAuthenticated, leadController.getLeads);
router.delete('/delete/:id', isAuthenticated, leadController.deleteLead);
router.put('/update/:id', isAuthenticated, leadController.updateLead);
router.get('/get/:id', isAuthenticated, leadController.getLeadById);


module.exports = router;