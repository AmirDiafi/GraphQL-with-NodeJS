const mongoose = require('mongoose')
const Schema = mongoose.Schema

const authorSchema = new Schema(
  {
    name: String,
    age: String,
  },
  { timestamps: true }
)

module.exports = mongoose.model('Author', authorSchema)
