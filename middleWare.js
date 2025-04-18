const jwt = require('jsonwebtoken')
const JWT_ACCESS_SECRET = 'your_access_secret'

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.sendStatus(401)

  const token = authHeader.split(' ')[1]
  try {
    const user = jwt.verify(token, JWT_ACCESS_SECRET)
    req.user = user
    next()
  } catch (e) {
    return res.status(403).json({ message: 'Токен недействителен' })
  }
}
