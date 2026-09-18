const express = require('express')
const {
  getInventory,
  getInventoryLogs,
  updateInventoryStock
} = require('../controllers/inventoryController')

const router = express.Router()

router.get('/', getInventory)
router.get('/logs', getInventoryLogs)
router.put('/:id/stock', updateInventoryStock)

module.exports = router