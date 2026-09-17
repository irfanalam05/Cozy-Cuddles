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

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params

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
      `UPDATE products
       SET name = $1,
           slug = $2,
           category = $3,
           description = $4,
           price = $5,
           sale_price = $6,
           stock = $7,
           sku = $8,
           images = $9,
           age_range = $10,
           features = $11,
           is_active = $12,
           is_bestseller = $13,
           is_new = $14,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $15
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
        is_new ?? false,
        id
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: result.rows[0]
    })
  } catch (error) {
    console.error('Update product error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
      product: result.rows[0]
    })
  } catch (error) {
    console.error('Delete product error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    })
  }
}

module.exports = {
  getProducts,createProduct, updateProduct, deleteProduct
}