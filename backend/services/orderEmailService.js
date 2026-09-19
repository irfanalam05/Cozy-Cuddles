const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

const sendOrderStatusEmail = async (order, status) => {
  let subject = ''
  let message = ''

  switch (status) {
    case 'Confirmed':
      subject = 'Your Cozy & Cuddles Order is Confirmed 🎉'
      message = `Hi ${order.customer_name},

Your order #${order.id} has been confirmed successfully.

Thank you for shopping with Cozy & Cuddles! ❤️`
      break

    case 'Processing':
      subject = 'Your Cozy & Cuddles Order is Being Processed'
      message = `Hi ${order.customer_name},

Your order #${order.id} is now being processed.

We are preparing your order. ❤️`
      break

    case 'Shipped':
      subject = 'Your Cozy & Cuddles Order Has Been Dispatched 🚚'
      message = `Hi ${order.customer_name},

Your order #${order.id} has been dispatched and is on its way to you.

Thank you for shopping with Cozy & Cuddles! ❤️`
      break

    case 'Delivered':
      subject = 'Your Cozy & Cuddles Order Has Been Delivered 🎉'
      message = `Hi ${order.customer_name},

Your order #${order.id} has been delivered successfully.

We hope you enjoy your purchase! ❤️`
      break

    case 'Cancelled':
      subject = 'Your Cozy & Cuddles Order Has Been Cancelled'
      message = `Hi ${order.customer_name},

Your order #${order.id} has been cancelled.

If you have any questions, please contact Cozy & Cuddles support.`
      break

    default:
      return
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.customer_email,
      subject,
      text: message,
    })

    console.log(`Order ${status} email sent to ${order.customer_email}`)
  } catch (error) {
    console.error(`Order ${status} email error:`, error)
  }
}

module.exports = {
  sendOrderStatusEmail,
}