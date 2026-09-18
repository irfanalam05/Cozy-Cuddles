const pool = require('../config/database')

const getInventory = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        sku,
        stock,
        is_active,
        updated_at
      FROM products
      ORDER BY id ASC
    `)

    res.json({
      success: true,
      inventory: result.rows
    })
  } catch (error) {
    console.error('Get inventory error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory'
    })
  }
}

const getInventoryLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        l.id,
        l.product_id,
        p.name AS product_name,
        p.sku,
        l.change_type,
        l.quantity,
        l.previous_stock,
        l.new_stock,
        l.note,
        l.created_at
      FROM inventory_logs l
      JOIN products p ON l.product_id = p.id
      ORDER BY l.created_at DESC
    `)

    res.json({
      success: true,
      logs: result.rows
    })
  } catch (error) {
    console.error('Get inventory logs error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory logs'
    })
  }
}

const updateInventoryStock = async (req, res) => {
  const client = await pool.connect()

  try {
    const { id } = req.params
    const { action, quantity, note } = req.body

    if (!['add', 'set'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid inventory action'
      })
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a valid non-negative number'
      })
    }

    await client.query('BEGIN')

    const productResult = await client.query(
      `SELECT id, name, stock
       FROM products
       WHERE id = $1
       FOR UPDATE`,
      [id]
    )

    if (productResult.rows.length === 0) {
      await client.query('ROLLBACK')

      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    const product = productResult.rows[0]

    const previousStock = product.stock
    const newStock =
      action === 'add'
        ? previousStock + quantity
        : quantity

    const stockChange = newStock - previousStock

    await client.query(
      `UPDATE products
       SET stock = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [newStock, id]
    )

    await client.query(
      `INSERT INTO inventory_logs
       (
         product_id,
         change_type,
         quantity,
         previous_stock,
         new_stock,
         note
       )
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        id,
        action === 'add' ? 'ADD_STOCK' : 'SET_STOCK',
        stockChange,
        previousStock,
        newStock,
        note || `Stock updated for ${product.name}`
      ]
    )

    await client.query('COMMIT')

    res.json({
      success: true,
      message: 'Stock updated successfully',
      stock: newStock
    })
  } catch (error) {
    await client.query('ROLLBACK')

    console.error('Update inventory stock error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to update inventory stock'
    })
  } finally {
    client.release()
  }
}

module.exports = {
  getInventory,
  getInventoryLogs,
  updateInventoryStock
}