import express from 'express'
import prism from '@prisma/client'
import { hash } from 'argon2'
import jwt from 'jsonwebtoken'
import { genRefreshToken, genAccessToken } from '../helpers/tokens.js'
import { auth as authMiddleware } from '../middlewares/auth.js'

const auth = express.Router()
const { PrismaClient } = prism
const prisma = new PrismaClient()
const { verify: verifyJwt } = jwt

auth.get('/me', authMiddleware, async (req, res) => {
  const { id } = req.user
  const user = await prisma.user.findUnique({
    select: {
      name: true,
      email: true
    },
    where: {
      id
    }
  })
  res.json({ user })
})

// /auth/login
auth.post('/login', (req, res) => {})

// /auth/register
auth.post('/register', async (req, res) => {
  let { password } = req.body
  password = await hash(password)
  req.body.password = password
  const user = await prisma.user.create({
    data: req.body
  })
  let rToken = genRefreshToken({ id: user.id })
  // SAVE refresh token
  const { id: rid } = await prisma.refreshtoken.create({
    data: {
      token: rToken,
      userId: user.id
    }
  })
  let aToken = genAccessToken({ id: user.id, rid })
  res.json({ aToken, rToken })
})

// refresh token
auth.get('/refresh', async (req, res) => {
  const { rToken } = req.query
  let id
  try {
    let payload = verifyJwt(rToken, process.env.JWT_REFRESH_SECRET)
    id = payload.id
  } catch (error) {
    return res.status(401).json({ msg: error.message })
  }
  try {
    const user = await prisma.user.findUnique({
      select: {
        email: true,
        name: true,
        refreshTokens: true
      },
      where: {
        id
      }
    })
    const valido = user.refreshTokens.find((r) => r.token == rToken)
    if (!valido) {
      return res.status(401).json({ msg: 'INVALID TOKEN' })
    }
    const aToken = genAccessToken({ id, rid: valido.id })
    res.json({ aToken, user })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
})

export default auth
