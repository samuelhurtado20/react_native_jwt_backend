import express, { json } from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import auth from './routes/auth.js'
import posts from './routes/posts.js'

const app = express()
const port = process.env.PORT || 3000
if (process.env.NODE_ENV != 'production') {
  //const morgan = require('morgan')
  dotenv.config()
  app.use(morgan('dev'))
}
app.use(json())

// routes
app.use('/auth', auth)
app.use('/posts', posts)

app.listen(port, () => {
  console.log('Server running on port: ' + port)
})
