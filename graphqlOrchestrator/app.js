require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server')
const axios = require('axios')
const PORT_MOVIES = process.env.PORT_MOVIES || 'http://localhost:3000'
const PORT_SERIES = process.env.PORT_SERIES || 'http://localhost:3001'
const cors = require('cors')
app.use(cors())


let movie_tags = []
let tv_tags = []
const typeDefs = gql`

  type MovieTag {
    title: String
    age: Int  
  }
  
  type TvTag {
    title: String
  }
  
  type Movie {
    _id: ID
    title: String
    overview: String
    poster_path: String
    popularity: Int
    category: String
    tags: MovieTag
  }
  
  type Serie {
    _id: ID
    title: String
    overview: String
    poster_path: String
    popularity: Int
    category: String
    tags: TvTag
  }
  
  type Query {
    movies: [Movie]
    series: [Serie]
    dataMovie(id:ID): Movie,
    dataSerie(id:ID): Serie,
    movieTags: [MovieTag],
    tvTags:[TvTag]
  }
  
  
  type Mutation {
    addMovie(title: String, overview: String, poster_path: String, popularity: Int, category: String): Movie,
    addSerie(title: String, overview: String, poster_path: String, popularity: Int, category:String): Serie,
    removeMovie(id:ID):String
    removeSerie(id:ID):String
  }
`

const resolvers = {
  Query: {
    async movies() {
      try {
        const { data } = await axios.get(`${ PORT_MOVIES }/movies`)
        // movie_tags = data[ 0 ].tags
        // console.log("=======", movie_tags)
        return data
      } catch (err) {
        console.log(err)
      }
    },

    async series() {
      try {
        const { data } = await axios.get(`${ PORT_SERIES }/tv`)

        // tv_tags = data.tags

        return data
      } catch (err) {
        console.log(err)
      }
    },

    async dataMovie(parent, args) {
      try {
        const { data } = await axios.get(`${ PORT_MOVIES }/movies`)

        return data.find((movie) => movie._id === args.id)
      } catch (err) {
        console.log(err)
      }
    },
    async dataSerie(parent, args) {
      try {
        const { data } = await axios.get(`${ PORT_SERIES }/tv`)

        return data.find((serie) => serie._id === args.id)
      } catch (err) {
        console.log(err)
      }
    },

    movieTags() {
      // console.log("====", movie_tags)
      return movie_tags
    },

    tvTags() {
      return tv_tags
    }

  },

  Mutation: {
    async addMovie(parent, args) {
      // console.log(args)
      const { data } = await axios.post(`${ PORT_MOVIES }/movies`, args)
      console.log('masuk add movie, args:', args, `${ PORT_MOVIES }/movies`)

      return data
    },
    async addSerie(parent, args) {
      // console.log(args)
      const { data } = await axios.post(`${ PORT_SERIES }/tv`, args)

      return data
    },
    async removeMovie(parent, args) {
      console.log('remove movie', args)

      const { data } = await axios.delete(`${ PORT_MOVIES }/movies/` + args.id)

      // console.log('udah masuk removeMovie')
      return 'Success removing data'
    },
    async removeSerie(parent, args) {
      // console.log('remove movie', args)
      console.log('udah masuk remove serie')
      const { data } = await axios.delete(`${ PORT_SERIES }/tv/` + args.id)

      return 'Success removing data'
    }
  }
}


const server = new ApolloServer({ typeDefs, resolvers })

server.listen({ port: process.env.IP || 4000 }).then(({ url }) => {
  console.log(`server running on ${ url }`)
})