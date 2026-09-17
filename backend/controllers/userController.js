const pool = require('../config/database')

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users ORDER BY created_at DESC'
    )

    res.json({
      success: true,
      users: result.rows
    })
  } catch (error) {
    console.error('Get users error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    })
  }
}

module.exports = {
  getUsers
}