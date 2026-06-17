const pool = require('../config/db');

// POST /api/leads/:id/notes
const addNote = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const created_by = req.user.id;

  if (!content) {
    return res.status(400).json({ message: 'Note content is required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO notes (lead_id, content, created_by)
       VALUES ($1, $2, $3) RETURNING *`,
      [id, content, created_by]
    );

    const note = await pool.query(
      `SELECT n.*, u.name AS created_by_name
       FROM notes n
       LEFT JOIN users u ON n.created_by = u.id
       WHERE n.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json(note.rows[0]);
  } catch (err) {
    console.error('Add note error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM notes WHERE id=$1', [id]);
    res.json({ message: 'Note deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { addNote, deleteNote };