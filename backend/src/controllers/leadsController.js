const pool = require('../config/db');

// GET /api/leads
const getLeads = async (req, res) => {
  const { status, lead_source, assigned_to, search } = req.query;

  let query = `
    SELECT 
      l.*,
      u.name AS assigned_name
    FROM leads l
    LEFT JOIN users u ON l.assigned_to = u.id
    WHERE 1=1
  `;
  const params = [];
  let idx = 1;

  if (status) {
    query += ` AND l.status = $${idx++}`;
    params.push(status);
  }
  if (lead_source) {
    query += ` AND l.lead_source = $${idx++}`;
    params.push(lead_source);
  }
  if (assigned_to) {
    query += ` AND l.assigned_to = $${idx++}`;
    params.push(assigned_to);
  }
  if (search) {
    query += ` AND (l.lead_name ILIKE $${idx} OR l.company_name ILIKE $${idx} OR l.email ILIKE $${idx})`;
    params.push(`%${search}%`);
    idx++;
  }

  query += ' ORDER BY l.created_at DESC';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Get leads error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/leads/:id
const getLeadById = async (req, res) => {
  const { id } = req.params;
  try {
    const leadResult = await pool.query(
      `SELECT l.*, u.name AS assigned_name
       FROM leads l
       LEFT JOIN users u ON l.assigned_to = u.id
       WHERE l.id = $1`,
      [id]
    );

    if (leadResult.rows.length === 0) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    const notesResult = await pool.query(
      `SELECT n.*, u.name AS created_by_name
       FROM notes n
       LEFT JOIN users u ON n.created_by = u.id
       WHERE n.lead_id = $1
       ORDER BY n.created_at DESC`,
      [id]
    );

    res.json({ ...leadResult.rows[0], notes: notesResult.rows });
  } catch (err) {
    console.error('Get lead error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/leads
const createLead = async (req, res) => {
  const {
    lead_name, company_name, email, phone,
    lead_source, assigned_to, status, deal_value,
  } = req.body;

  if (!lead_name) {
    return res.status(400).json({ message: 'Lead name is required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO leads (lead_name, company_name, email, phone, lead_source, assigned_to, status, deal_value)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [lead_name, company_name, email, phone, lead_source, assigned_to || null, status || 'New', deal_value || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create lead error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// PUT /api/leads/:id
const updateLead = async (req, res) => {
  const { id } = req.params;
  const {
    lead_name, company_name, email, phone,
    lead_source, assigned_to, status, deal_value,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE leads
       SET lead_name=$1, company_name=$2, email=$3, phone=$4,
           lead_source=$5, assigned_to=$6, status=$7, deal_value=$8, updated_at=NOW()
       WHERE id=$9
       RETURNING *`,
      [lead_name, company_name, email, phone, lead_source, assigned_to || null, status, deal_value, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update lead error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/leads/:id
const deleteLead = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM leads WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lead not found.' });
    }
    res.json({ message: 'Lead deleted successfully.' });
  } catch (err) {
    console.error('Delete lead error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getLeads, getLeadById, createLead, updateLead, deleteLead };