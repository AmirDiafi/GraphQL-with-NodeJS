const express = require('express')
const app = express()
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const mdbLocalhost = 'mongodb://localhost:27017/graphql'
const CORS = require('cors')

// allow cors-origin requests
app.use(CORS({ origin: 'http://localhost:3000' }))

mongoose.connect(mdbLocalhost)

mongoose.connection.once('open', () => {
  console.log('connected to mongoDB')
})

const port = process.env.PORT || 5000

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
)

app.listen(port, () => console.log(`Listening on  http://localhost:${port}`))
