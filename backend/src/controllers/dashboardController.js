const pool = require('../config/db');

const getDashboard = async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(*) AS total_leads,
        COUNT(*) FILTER (WHERE status = 'New') AS new_leads,
        COUNT(*) FILTER (WHERE status = 'Qualified') AS qualified_leads,
        COUNT(*) FILTER (WHERE status = 'Won') AS won_leads,
        COUNT(*) FILTER (WHERE status = 'Lost') AS lost_leads,
        COALESCE(SUM(deal_value), 0) AS total_deal_value,
        COALESCE(SUM(deal_value) FILTER (WHERE status = 'Won'), 0) AS won_deal_value
      FROM leads
    `);

    const recentLeads = await pool.query(`
      SELECT l.*, u.name AS assigned_name
      FROM leads l
      LEFT JOIN users u ON l.assigned_to = u.id
      ORDER BY l.created_at DESC
      LIMIT 5
    `);

    res.json({
      stats: stats.rows[0],
      recentLeads: recentLeads.rows,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getDashboard };