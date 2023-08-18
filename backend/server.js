import path from 'path'
import express, { json } from 'express'
import dotenv from "dotenv"
dotenv.config()

import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

import {notFound, errorHandler} from './middleware/userMiddleware.js'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import cors from "cors"

const port  = process.env.PORT || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
// Configure CORS middleware
app.use(
    cors({
      origin: [
        'http://localhost:3000',
        'https://clinic-ms.vercel.app',
        'https://clinic-ms-reg.vercel.app'
      ],
      methods: ['POST', 'GET'],
      credentials: true
    })
);
app.use(cookieParser())
  
app.use("/api/users", userRoutes)
app.use("/api/admin", adminRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))
