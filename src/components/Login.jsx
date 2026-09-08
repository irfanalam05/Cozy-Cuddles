import { useState } from 'react'

function Login() {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  return (
    <section className="login-page">
      <div className="login-baby-wrap">
        <img
          src="/logo/sleeping-baby-clean.png"
          alt="Sleeping baby"
          className="login-sleeping-baby"
        />
        <div className="login-sleeping-zs" aria-hidden="true">
          <span>Z</span>
          <span>Z</span>
          <span>Z</span>
        </div>
      </div>
      <div className="login-card">
        <div className="login-heading">
          <p className="section-tag">
            {isSignup ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
          </p>

          <h1>{isSignup ? 'Create Account' : 'Customer Login'}</h1>

          <p>
            {isSignup
              ? 'Create your account and start shopping for your little one.'
              : 'Login to continue your Cozy & Cuddles journey.'}
          </p>
        </div>
        {successMessage && (
            <div className="success-message">
                {successMessage}
            </div>
        )}

        {isSignup && (
          <div className="login-field" >
            <label>Full Name</label>
            <input type="text" placeholder="Enter your name" required />
          </div>
        )}

        {isSignup && (
            <>
            <div className="login-field">
                <label>Phone Number</label>
                <input
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    pattern="[6-9][0-9]{9}"
                    maxLength="10"
                    required
                    title="Please enter a valid 10-digit mobile number"
                />

                <button
                    type="button"
                    className="otp-btn"
                    onClick={() => {
                        const phoneInput = document.querySelector('input[type="tel"]')
                        const nameInput = document.querySelector('.login-field input[type="text"]')
                        if (!nameInput.checkValidity()) {
                            nameInput.reportValidity()
                            return
                        }
                        if (!phoneInput.checkValidity()) {
                            phoneInput.reportValidity()
                            return
                        }

                        const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
                        setGeneratedOtp(newOtp)
                        alert(`Your OTP is: ${newOtp}`)
                    }}
                >
                    Send OTP
                </button>
            </div>

            <div className="login-field">
                <label>Phone OTP</label>
                <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    inputMode="numeric"
                    maxLength="6"
                    pattern="[0-9]{6}"
                    required
                    title="Please enter a valid 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
            </div>
            </>
        )}

        <div className="login-field">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" pattern="[a-zA-Z0-9._%+-]+@gmail\.com" title="Please enter a valid Gmail address" required value={email} onChange={(e) => setEmail(e.target.value)}
            />
        </div>

        <div className="login-field">
          <label>Password</label>
            <input type="password" placeholder="Enter your password" minLength="8" required value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        {isSignup && (
            <div className="login-field">
                <label>Confirm Password</label>
                <input
                    type="password"
                    placeholder="Confirm your password"
                    minLength="8"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
        )}

        <button className="login-submit" onClick={(e) => {
                if (isSignup) {
                const inputs = document.querySelectorAll('.login-field input')

                for (const input of inputs) {
                    if (!input.checkValidity()) {
                        input.reportValidity()
                        return
                    }
                }

                if (password !== confirmPassword) {
                alert('Passwords do not match!')
                return
                }
                if (otp !== generatedOtp) {
                    alert('Please enter the correct OTP!')
                    return
                }

                setSuccessMessage('Account created successfully!')

                setTimeout(() => {
                window.location.hash = '#/'
                }, 5000)
            }
            else {
                if (email === 'demo@gmail.com' && password === 'Demo@1234') {
                    window.location.hash = '#/'
                } else {
                    alert('Invalid email or password!')
                }
            }
            }}
            >
            {isSignup ? 'Create Account' : 'Login'}
        </button>

        <div className="login-divider">
            <span>OR</span>
        </div>

        <button className="google-login-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" className="google-icon" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            Continue with Google
        </button>

        {!isSignup && (
          <button className="forgot-password">
            Forgot Password?
          </button>
        )}

        <div className="login-switch">
            <span>
             {isSignup ? 'Already have an account?' : "Don't have an account?"}
            </span>

          <button onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </div>

        <button
          className="back-btn"
          onClick={() => {
            window.location.hash = '#/'
          }}
        >
          ← Back to Home
        </button>
      </div>
    </section>
  )
}

export default Login