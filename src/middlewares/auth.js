import pkg from 'jsonwebtoken'
const { verify } = pkg

export function auth(req, res, next) {
  const aToken = req.header('AUTENTICATION')
  if (!aToken) {
    return res.status(498).json({ msg: 'HEADER AUTENTICATION IS REQUIRED' })
  }
  try {
    const payload = verify(aToken, process.env.JWT_ACCESS_SECRET)
    req.user = payload
    next()
  } catch (error) {
    return res.status(498).json({ msg: error.message })
  }
}
