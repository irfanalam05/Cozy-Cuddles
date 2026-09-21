const express = require('express')
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController')
const upload = require('../middleware/uploadMiddleware')

const router = express.Router()

router.get('/', getProducts)
router.post('/', upload.array('images', 10), createProduct)
router.put('/:id', upload.array('images', 10), updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router