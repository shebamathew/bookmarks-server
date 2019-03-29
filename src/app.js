require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const bookmarksRouter = require('./bookmarks-router')
const BookmarksService = require('./bookmarks-service')
const logger = require('./logger')

const app = express()

const morganOption = app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}))
app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())
app.use(express.json()); 

app.get('/bookmarks', (req, res, next) => {
  const knexInstance = req.app.get('db')
  BookmarksService.getAllBookmarks(knexInstance)
    .then(articles => {
      res.json(articles)
    })
    .catch(next)
})

//validate bearer token
app.use(function (req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
  console.log(authToken);
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  next()
})

app.use('/api/bookmarks', bookmarksRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next){
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app