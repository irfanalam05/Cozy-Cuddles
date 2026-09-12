require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: 'cozy_cuddles',
  password: process.env.DB_PASSWORD,
  port: 5432,
})

pool.on('connect', () => {
  console.log('PostgreSQL database connected successfully!')
})

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error:', err)
})

module.exports = pool