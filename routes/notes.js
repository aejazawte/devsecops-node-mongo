const express = require('express');
const router = express.Router();
const Note = require('../models/Note');


// Create note
router.post('/', async (req, res) => {
try {
const n = new Note(req.body);
const saved = await n.save();
res.status(201).json(saved);
} catch (err) {
res.status(400).json({ error: err.message });
}
});


// List notes
router.get('/', async (req, res) => {
try {
const notes = await Note.find().sort({ createdAt: -1 }).limit(100);
res.json(notes);
} catch (err) {
res.status(500).json({ error: err.message });
}
});


// Get single
router.get('/:id', async (req, res) => {
try {
const note = await Note.findById(req.params.id);
if (!note) return res.status(404).json({ error: 'Not found' });
res.json(note);
} catch (err) {
res.status(400).json({ error: err.message });
}
});


// Update
router.put('/:id', async (req, res) => {
try {
const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(updated);
} catch (err) {
res.status(400).json({ error: err.message });
}
});


// Delete
router.delete('/:id', async (req, res) => {
try {
await Note.findByIdAndDelete(req.params.id);
res.status(204).end();
} catch (err) {
res.status(400).json({ error: err.message });
}
});


module.exports = router;
