import pkg from 'jsonwebtoken'
const { sign } = pkg

export function genAccessToken({ id, rid }) {
  // id refresh token
  return sign({ id, rid }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '30s'
  })
}

export function genRefreshToken({ id }) {
  return sign({ id }, process.env.JWT_REFRESH_SECRET)
}
