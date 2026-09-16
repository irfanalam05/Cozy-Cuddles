const pool = require('../config/database')
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      price,
      sale_price,
      stock,
      sku,
      images,
      age_range,
      features,
      is_active,
      is_bestseller,
      is_new
    } = req.body

    const result = await pool.query(
      `INSERT INTO products
      (name, slug, category, description, price, sale_price, stock, sku, images, age_range, features, is_active, is_bestseller, is_new)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        name,
        name.toLowerCase().replace(/\s+/g, '-'),
        category,
        description,
        price,
        sale_price || null,
        stock || 0,
        sku,
        images || null,
        age_range || null,
        features || [],
        is_active ?? true,
        is_bestseller ?? false,
        is_new ?? false
      ]
    )

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: result.rows[0]
    })
  } catch (error) {
    console.error('Create product error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    })
  }
}

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
  getProducts,createProduct
}