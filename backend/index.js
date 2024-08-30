import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/connectDB.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import bookRoutes from './routes/bookRoutes.js'
import exchangeRoutes from './routes/exchangeRoutes.js'


dotenv.config()

connectDB()
const app = express()
const PORT = process.env.PORT || 5000

// middlewares
app.use(express.json({ limit: '50mb' })) //parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })) //usually parses form data extended:true used to parse nested data if present
app.use(cookieParser()) //parse cookies
var allowedOrigins = [
  'http://localhost:5173',
]

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['POST', 'GET', 'DELETE', 'PUT'],

    // exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],

    credentials: true,
  })
)

// test route
app.get('/',(req,res)=>{
  res.status(200).send("Server is ready")
})

// Routes
app.use('/api/users', userRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/exchange', exchangeRoutes)

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})