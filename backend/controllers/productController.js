const pool = require('../config/database')
const createProduct = async (req, res) => {
  try {
  const {
    name,
    category,
    product_type,
    description,
    price,
    sale_price,
    stock,
    sku,
    age_range,
    features,
    is_active,
    is_bestseller,
    is_new
} = req.body

const categoryFolderMap = {
  'Mosquito Beds': 'mosquito-bed',
  'Baby Playgyms': 'baby-playgyms',
  'Baby Tricycle': 'baby-tricycles',
  'Baby Bullets': 'baby-bullets',
  'Baby Walker': 'baby-walkers',
  'Ride On Toys': 'ride-on-toys',
  'Swings': 'swings',
  'Sleeping Bags': 'sleeping-bags',
  'Sleeping Swings': 'sleeping-swings'
}

const categoryFolder =
  categoryFolderMap[category] ||
  category.toLowerCase().replace(/\s+/g, '-')

const productFolder = product_type
  .toLowerCase()
  .replace(/\s+/g, '-')

const images = req.files
  ? req.files.map(
      (file) =>
        `/products/${categoryFolder}/${productFolder}/${file.filename}`
    )
  : []

const parsedFeatures = features
  ? features.split(',').map((feature) => feature.trim())
  : []


    const result = await pool.query(
      `INSERT INTO products
      (name, slug, category, product_type, description, price, sale_price, stock, sku, images, age_range, features, is_active, is_bestseller, is_new)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        name,
        name.toLowerCase().replace(/\s+/g, '-'),
        category,
        product_type,
        description,
        price,
        sale_price || null,
        stock || 0,
        sku,
        images,
        age_range || null,
        parsedFeatures,
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
        product_type,
        description,
        price,
        sale_price,
        stock,
        sku,
        age_range,
        features,
        is_active,
        is_bestseller,
        is_new
    } = req.body

    const existingProduct = await pool.query(
      'SELECT images FROM products WHERE id = $1',
      [id]
    )

    const existingImages = existingProduct.rows[0]?.images || []

    const categoryFolderMap = {
      'Mosquito Beds': 'mosquito-bed',
      'Baby Playgyms': 'baby-playgyms',
      'Baby Tricycle': 'baby-tricycles',
      'Baby Bullets': 'baby-bullets',
      'Baby Walker': 'baby-walkers',
      'Ride On Toys': 'ride-on-toys',
      'Swings': 'swings',
      'Sleeping Bags': 'sleeping-bags',
      'Sleeping Swings': 'sleeping-swings'
    }

    const categoryFolder =
      categoryFolderMap[category] ||
      category.toLowerCase().replace(/\s+/g, '-')

    const productFolder = product_type
      .toLowerCase()
      .replace(/\s+/g, '-')

    const newImages = req.files
      ? req.files.map(
          (file) =>
            `/products/${categoryFolder}/${productFolder}/${file.filename}`
        )
      : []

    const images = [...existingImages, ...newImages]

    const parsedFeatures = features
      ? features.split(',').map((feature) => feature.trim())
      : []

    const result = await pool.query(
      `UPDATE products
       SET name = $1,
          slug = $2,
          category = $3,
          product_type = $4,
          description = $5,
          price = $6,
          sale_price = $7,
          stock = $8,
          sku = $9,
          images = $10,
          age_range = $11,
          features = $12,
          is_active = $13,
          is_bestseller = $14,
          is_new = $15,
          updated_at = CURRENT_TIMESTAMP
       WHERE id = $16
       RETURNING *`,
      [
        name,
        name.toLowerCase().replace(/\s+/g, '-'),
        category,
        product_type,
        description,
        price,
        sale_price || null,
        stock || 0,
        sku,
        images || null,
        age_range || null,
        parsedFeatures,
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