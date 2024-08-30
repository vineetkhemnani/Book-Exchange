import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie = (userId, res) => {
  // Determine if the environment is production or development
  const isProduction = process.env.NODE_ENV === 'production'

  // Generate the JWT token with a 15-day expiration
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15d',
  })

  // Create the cookie with appropriate options
  res.cookie('jwt', token, {
    httpOnly: true, // more secure -> cookie cannot be accessed by the browser
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    sameSite: 'none', // CSRF protection
    secure: isProduction, // cookie is sent only over HTTPS in production
  })

  return token
}

export default generateTokenAndSetCookie
