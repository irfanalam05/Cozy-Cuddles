import { useState } from 'react'

function AdminLogin() {
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [otpError, setOtpError] = useState('')
    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })
    

        const data = await response.json()
        if (data.success) {
            setOtpSent(true)
        }
        }
        catch (error) {
            console.error('Login error:', error)
        }
    }

    const handleResendOTP = async () => {
        setOtp('')
        setOtpError('')
        await handleLogin()
    }

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            setOtpError('Please enter a valid 6-digit OTP')
            return
        }
        try {
            const response = await fetch('http://localhost:5000/api/admin/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                otp,
            }),
            })

            const data = await response.json()

            console.log(data)
            if (data.success) {
                localStorage.setItem('adminToken', data.token)
                window.location.hash = '#/admin/dashboard'
            }else {
                setOtpError(data.message || 'Invalid or expired OTP')
            }
        } catch (error) {
            console.error('OTP verification error:', error)
            setOtpError('Something went wrong. Please try again.')
        }
    }

  return (
    <section className="login-page">
      <div className="login-card admin-login-card">
        <div className="login-heading">
          <p className="section-tag">ADMIN PANEL</p>

          <h1>Admin Login</h1>

          <p>
            Login to manage your Cozy & Cuddles store.
          </p>
        </div>

        <div className="login-field">
            <label>Admin Email</label>
            <input
                type="email"
                placeholder="Enter admin email"
                pattern="[a-zA-Z0-9._%+-]+@gmail\.com"
                title="Please enter a valid Gmail address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
        </div>

        <div className="login-field">
          <label>Password</label>
          <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
        </div>

        {!otpSent ? (
                    <button className="login-submit" onClick={handleLogin}>
                        Send OTP
                    </button>
                ) : (
                <>
                <div className="login-field" required>
                    <label>Enter OTP</label>
                    <input type="text" placeholder="Enter 6-digit OTP" maxLength="6" value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    />
                    {otpError && (
                        <p style={{ color: 'red', marginTop: '6px' }}>
                            {otpError}
                        </p>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="login-submit" onClick={handleVerifyOTP}>
                        Verify OTP
                    </button>

                    <button className="login-submit" onClick={handleResendOTP}>
                        Resend OTP
                    </button>
                </div>
            </>
            )}

            <button className="back-btn" onClick={() => {
                if (otpSent) {
                    setOtpSent(false)
                    setOtp('')
                    setOtpError('')
                } else {
                    window.location.hash = '#/'
                    window.scrollTo(0, 0)
                }
            }}>
                {otpSent ? '← Back to Login' : '← Back to Home'}
            </button>
        </div>
    </section>
  )
}

export default AdminLogin