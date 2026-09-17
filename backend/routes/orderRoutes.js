const express = require('express')
const { getOrders, updateOrderStatus } = require('../controllers/orderController')

const router = express.Router()

router.get('/', getOrders)
router.put('/:id/status', updateOrderStatus)

module.exports = router