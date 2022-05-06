import express from 'express'
const posts = express.Router()
import pkg from '@prisma/client'
const { PrismaClient } = pkg
import { auth } from '../middlewares/auth.js'
const prisma = new PrismaClient()

posts.get('/', auth, async (req, res) => {
  const { id } = req.user
  const posts = await prisma.post.findMany({
    where: {
      userId: id
    }
  })
  res.json(posts)
})

posts.post('/', auth, async (req, res) => {
  const { id } = req.user
  const post = await prisma.post.create({
    data: {
      content: req.body.content,
      userId: id
    }
  })
  res.json(post)
})

export default posts
