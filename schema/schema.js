const graphql = require('graphql')
const Book = require('../models/book')
const Author = require('../models/author')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = graphql

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    title: { type: GraphQLString },
    genre: { type: GraphQLString },
    authorId: { type: GraphQLID },
    _id: { type: GraphQLID },
    author: {
      type: AuthorType,
      resolve(parent, _args) {
        return Author.findById(parent.authorId)
      },
    },
  }),
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    _id: { type: GraphQLID },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, _args) {
        return Book.find({ authorId: parent._id })
      },
    },
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(_parent, args) {
        return Book.findById(args.id)
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(_parent, args) {
        return Author.findById(args.id)
      },
    },
    books: {
      type: new GraphQLList(BookType),
      args: {
        limit: { type: GraphQLInt },
        page: { type: GraphQLInt },
      },
      resolve(_parent, args) {
        const { limit, page } = args
        const start = (page - 1) * limit
        return Book.find({}).skip(start).limit(limit)
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      args: {
        limit: { type: GraphQLInt },
        page: { type: GraphQLInt },
      },
      resolve(_parent, args) {
        const { limit, page } = args
        const start = (page - 1) * limit
        return Author.find({}).skip(start).limit(limit)
      },
    },
  },
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addBook: {
      type: BookType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(_parent, args) {
        const book = new Book({
          title: args.title,
          genre: args.genre,
          authorId: args.authorId,
        })
        return book.save()
      },
    },
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(_parent, args) {
        const author = new Author({
          name: args.name,
          age: args.age,
          authorId: args.authorId,
        })
        return author.save()
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
})
