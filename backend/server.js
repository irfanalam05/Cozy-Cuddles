const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const productRoutes = require('./routes/productRoutes')
const adminRoutes = require('./routes/adminRoutes')
const orderRoutes = require('./routes/orderRoutes')
const inventoryRoutes = require('./routes/inventoryRoutes')
const userRoutes = require('./routes/userRoutes')

// Middleware
app.use(cors())
app.use(express.json())
app.use('/api/products', productRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/users', userRoutes)

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