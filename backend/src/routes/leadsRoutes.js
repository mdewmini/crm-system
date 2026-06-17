const express = require('express');
const router = express.Router();
const { getLeads, getLeadById, createLead, updateLead, deleteLead } = require('../controllers/leadsController');
const { addNote, deleteNote } = require('../controllers/notesController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getLeads);
router.get('/:id', getLeadById);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

router.post('/:id/notes', addNote);

module.exports = router;