const bcrypt = require('bcryptjs')
const readline = require('readline')
const pool = require('./config/database')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const ask = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}

async function createAdmin() {
  try {
    const name = await ask('Admin name: ')
    const email = await ask('Admin email: ')
    const password = await ask('Admin password: ')

    const passwordHash = await bcrypt.hash(password, 10)

    await pool.query(
      'INSERT INTO admins (name, email, password_hash) VALUES ($1, $2, $3)',
      [name, email, passwordHash]
    )

    console.log('Admin created successfully!')
  } catch (error) {
    console.error('Failed to create admin:', error.message)
  } finally {
    rl.close()
    await pool.end()
  }
}

createAdmin()