const pool = require('../config/database')

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
  try {
    const { id } = req.params
    const { order_status } = req.body

    const result = await pool.query(
      `UPDATE orders
       SET order_status = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [order_status, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: result.rows[0]
    })
  } catch (error) {
    console.error('Update order status error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    })
  }
}

module.exports = {
  getOrders, updateOrderStatus
}