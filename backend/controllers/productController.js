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

const getProducts = (req, res) => {
  res.json({
    success: true,
    products
  })
}

module.exports = {
  getProducts
}