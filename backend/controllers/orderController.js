const pool = require('../config/database')
const { sendOrderStatusEmail } = require('../services/orderEmailService')

const getOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        o.id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.shipping_address,
        o.total_amount,
        o.payment_status,
        o.order_status,
        o.created_at,
        o.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'quantity', oi.quantity,
              'price', oi.price,
              'product_name', p.name
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `)

    res.json({
      success: true,
      orders: result.rows
    })
  } catch (error) {
    console.error('Get orders error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    })
  }
}

const updateOrderStatus = async (req, res) => {
  const client = await pool.connect()

  try {
    const { id } = req.params
    const { order_status } = req.body

    await client.query('BEGIN')

    const orderResult = await client.query(
      `SELECT id, order_status
       FROM orders
       WHERE id = $1
       FOR UPDATE`,
      [id]
    )

    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK')

      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    const currentStatus = orderResult.rows[0].order_status

    if (currentStatus !== 'Cancelled' && order_status === 'Cancelled') {
      const itemsResult = await client.query(
        `SELECT product_id, quantity
         FROM order_items
         WHERE order_id = $1`,
        [id]
      )

      for (const item of itemsResult.rows) {
        const productResult = await client.query(
          `SELECT id, name, stock
           FROM products
           WHERE id = $1
           FOR UPDATE`,
          [item.product_id]
        )

        if (productResult.rows.length === 0) {
          throw new Error(`Product ${item.product_id} not found`)
        }

        const product = productResult.rows[0]
        const newStock = product.stock + item.quantity

        await client.query(
          `UPDATE products
           SET stock = $1,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $2`,
          [newStock, item.product_id]
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
            item.product_id,
            'CANCELLED',
            item.quantity,
            product.stock,
            newStock,
            `Stock restored for Cancelled Order #${id}`
          ]
        )
      }
    }

    const result = await client.query(
      `UPDATE orders
       SET order_status = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [order_status, id]
    )

    await client.query('COMMIT')
    
    if (currentStatus !== order_status) {
    await sendOrderStatusEmail(result.rows[0], order_status)
  }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: result.rows[0]
    })
  } catch (error) {
    await client.query('ROLLBACK')

    console.error('Update order status error:', error)

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update order status'
    })
  } finally {
    client.release()
  }
}

const createOrder = async (req, res) => {
  const client = await pool.connect()

  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      total_amount,
      payment_status = 'Pending',
      order_status = 'Confirmed',
      items
    } = req.body

    if (
      !customer_name ||
      total_amount === undefined ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Customer details and order items are required'
      })
    }

    await client.query('BEGIN')

    const orderResult = await client.query(
      `INSERT INTO orders
       (
         customer_name,
         customer_email,
         customer_phone,
         shipping_address,
         total_amount,
         payment_status,
         order_status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        customer_name,
        customer_email || null,
        customer_phone || null,
        shipping_address || null,
        total_amount,
        payment_status,
        order_status
      ]
    )

    const order = orderResult.rows[0]

    for (const item of items) {
      const productResult = await client.query(
        `SELECT id, name, price, sale_price, stock, is_active
         FROM products
         WHERE id = $1
         FOR UPDATE`,
        [item.product_id]
      )

      if (productResult.rows.length === 0) {
        throw new Error(`Product ${item.product_id} not found`)
      }

      const product = productResult.rows[0]

      if (!product.is_active) {
        throw new Error(`${product.name} is currently unavailable`)
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error(`Invalid quantity for ${product.name}`)
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}. Available stock: ${product.stock}`
        )
      }

      const itemPrice = product.sale_price ?? product.price
      const newStock = product.stock - item.quantity

      await client.query(
        `INSERT INTO order_items
         (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [
          order.id,
          item.product_id,
          item.quantity,
          itemPrice
        ]
      )

      await client.query(
        `UPDATE products
         SET stock = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [newStock, item.product_id]
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
          item.product_id,
          'ORDER',
          -item.quantity,
          product.stock,
          newStock,
          `Stock reduced for Order #${order.id}`
        ]
      )
    }

    await client.query('COMMIT')

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    })
  } catch (error) {
    await client.query('ROLLBACK')

    console.error('Create order error:', error)

    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create order'
    })
  } finally {
    client.release()
  }
}

module.exports = {
  getOrders, updateOrderStatus, createOrder
}