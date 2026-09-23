const express = require('express')
const pool = require('../config/database')

const router = express.Router()

// Get all categories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, code, folder_name
       FROM categories
       ORDER BY id`
    )

    res.json(result.rows)
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({ message: 'Failed to fetch categories' })
  }
})
router.get('/:categoryId/product-types', async (req, res) => {
  try {
    const { categoryId } = req.params

    const result = await pool.query(
      `SELECT id, name, code, folder_name
       FROM product_types
       WHERE category_id = $1
       ORDER BY id`,
      [categoryId]
    )

    res.json(result.rows)
  } catch (error) {
    console.error('Get product types error:', error)
    res.status(500).json({ message: 'Failed to fetch product types' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, code, folder_name } = req.body

    if (!name || !code || !folder_name) {
      return res.status(400).json({
        success: false,
        message: 'Category name, code and folder name are required'
      })
    }

    const existingCategory = await pool.query(
      `SELECT id, name, code, folder_name
       FROM categories
       WHERE LOWER(name) = LOWER($1)
          OR LOWER(code) = LOWER($2)
          OR LOWER(folder_name) = LOWER($3)`,
      [name.trim(), code.trim(), folder_name.trim()]
    )

    if (existingCategory.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Category name, code or folder name already exists'
      })
    }

    const result = await pool.query(
      `INSERT INTO categories
       (name, code, folder_name)
       VALUES ($1, $2, $3)
       RETURNING id, name, code, folder_name`,
      [
        name.trim(),
        code.trim().toUpperCase(),
        folder_name.trim()
      ]
    )

    res.status(201).json({
      success: true,
      message: 'Category added successfully',
      category: result.rows[0]
    })
  } catch (error) {
    console.error('Add category error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to add category'
    })
  }
})

router.post('/:categoryId/product-types', async (req, res) => {
  try {
    const { categoryId } = req.params
    const { name, code, folder_name } = req.body

    if (!name || !code || !folder_name) {
      return res.status(400).json({
        success: false,
        message: 'Product type name, code and folder name are required'
      })
    }

    const existingProductType = await pool.query(
      `SELECT id, name, code, folder_name
       FROM product_types
       WHERE category_id = $1
         AND (
           LOWER(name) = LOWER($2)
           OR LOWER(code) = LOWER($3)
           OR LOWER(folder_name) = LOWER($4)
         )`,
      [
        categoryId,
        name.trim(),
        code.trim(),
        folder_name.trim()
      ]
    )

    if (existingProductType.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Product type name, code or folder name already exists in this category'
      })
    }

    const result = await pool.query(
      `INSERT INTO product_types
       (category_id, name, code, folder_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, category_id, name, code, folder_name`,
      [
        categoryId,
        name.trim(),
        code.trim().toUpperCase(),
        folder_name.trim()
      ]
    )

    res.status(201).json({
      success: true,
      message: 'Product type added successfully',
      productType: result.rows[0]
    })
  } catch (error) {
    console.error('Add product type error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to add product type'
    })
  }
})

module.exports = router