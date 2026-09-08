import { useState } from 'react'

function AdminLogin() {
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState('')
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
            <input type="email" placeholder="Enter admin email" pattern="[a-zA-Z0-9._%+-]+@gmail\.com"
                title="Please enter a valid Gmail address" required
            />
        </div>

        <div className="login-field">
          <label>Password</label>
          <input type="password" placeholder="Enter admin password" required />
        </div>

        {!otpSent ? (
                    <button className="login-submit" onClick={() => setOtpSent(true)}>
                        Send OTP
                    </button>
                ) : (
                <>
                <div className="login-field" required>
                    <label>Enter OTP</label>
                    <input type="text" placeholder="Enter 6-digit OTP" maxLength="6" value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    />
                </div>

                <button className="login-submit" onClick={() => {
                    if (otp.length !== 6) {
                        alert('Please enter a valid 6-digit OTP!')
                        return
                    }
                    window.location.hash = '#/YWRtaW5kYXNoYm9hcmQ='
                    }}
                    >
                    Verify OTP
                </button>
            </>
            )}

            <button className="back-btn" onClick={() => {
                    window.location.hash = '#/'
                }}
                >
                  ← Back to Home
            </button>
        </div>
    </section>
  )
}

export default AdminLogin