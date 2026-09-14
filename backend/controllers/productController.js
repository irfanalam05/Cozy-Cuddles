const pool = require('../config/database')
const products = [
  {
    id: 1,
    name: 'Cute Baby Romper',
    category: 'Clothing',
    price: 599,
    description: 'Soft and comfortable romper for babies.'
  },
  {
    id: 2,
    name: 'Baby Cotton Blanket',
    category: 'Baby Care',
    price: 799,
    description: 'Soft cotton blanket for your little one.'
  },
  {
    id: 3,
    name: 'Plush Teddy Bear',
    category: 'Toys',
    price: 499,
    description: 'Cute and cuddly teddy bear.'
  }
]

const getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY id'
    )

    res.json({
      success: true,
      products: result.rows
    })
  } catch (error) {
    console.error('Get products error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    })
  }
}

module.exports = {
  getProducts
}