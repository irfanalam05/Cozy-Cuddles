const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const pool = require('../config/database')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

const saveOTP = async (adminId, otp) => {
  const expiresAt = new Date(
    Date.now() + Number(process.env.OTP_EXPIRES_MINUTES || 5) * 60 * 1000
  )

  await pool.query(
    'DELETE FROM admin_otps WHERE admin_id = $1',
    [adminId]
  )

  await pool.query(
    'INSERT INTO admin_otps (admin_id, otp, expires_at) VALUES ($1, $2, $3)',
    [adminId, otp, expiresAt]
  )
  console.log('OTP saved:', otp)
}

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })
    }

    const result = await pool.query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    const admin = result.rows[0]

    const isPasswordValid = await bcrypt.compare(
      password,
      admin.password_hash
    )

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }
    const otp = generateOTP()
    await saveOTP(admin.id, otp)

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: admin.email,
      subject: 'Cozy & Cuddles Admin OTP',
      text: `Your admin login OTP is ${otp}. It will expire in ${process.env.OTP_EXPIRES_MINUTES || 5} minutes.`,
    })

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    })
  } catch (error) {
    console.error('Admin login error:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      })
    }

    const result = await pool.query(
      `SELECT admin_otps.*, admins.email
       FROM admin_otps
       JOIN admins ON admin_otps.admin_id = admins.id
       WHERE admins.email = $1
       AND admin_otps.otp = $2
       AND admin_otps.expires_at > NOW()
       ORDER BY admin_otps.id DESC
       LIMIT 1`,
      [email, otp]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired OTP',
      })
    }

    const adminResult = await pool.query(
      'SELECT id, name, email FROM admins WHERE email = $1',
      [email]
    )

    const admin = adminResult.rows[0]

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )

    await pool.query(
      'DELETE FROM admin_otps WHERE admin_id = $1',
      [admin.id]
    )

    res.json({
      success: true,
      message: 'OTP verified successfully',
      token,
      admin,
    })
  } catch (error) {
    console.error('OTP verification error:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}

module.exports = {
  loginAdmin,
  verifyOTP,
}