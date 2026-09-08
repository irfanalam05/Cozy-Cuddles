const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const productRoutes = require('./routes/productRoutes')

// Middleware
app.use(cors())
app.use(express.json())
app.use('/api/products', productRoutes)

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Cozy & Cuddles Backend is running!'
  })
})

// Server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})