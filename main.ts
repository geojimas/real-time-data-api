import * as dotenv from 'dotenv'
import Koa from 'koa'
import http from 'http'
import { Socket, Server as SocketIOServer } from 'socket.io'
import bodyParser from 'koa-body'
import path from 'path'
import serve from 'koa-static'
import send from 'koa-send'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import logger from 'koa-logger'
import { connectDB } from './src/database/dbConnection'
import { generateBitcoinValues } from './src/services/bitcoinService'

dotenv.config()
const corsConfig = { origin: 'https://real-time-data-api.onrender.com' }

const app = new Koa()
const server = http.createServer(app.callback())
const io = new SocketIOServer(server, {
  cors: {
    origin: corsConfig.origin,
    methods: ['GET', 'POST'],
  },
})

//Middlewares
app
  .use(logger())
  .use(bodyParser())
  .use(helmet())
  .use(cors(corsConfig))
  .use(serve(path.join(__dirname, '../client/dist')))
  .use(async (ctx) => {
    await send(ctx, 'index.html', { root: path.join(__dirname, '../client/dist') })
  })

// Connect to the database
connectDB().then(() => console.log('DB Connected'))

// Socket.IO connection handler
io.on('connection', (socket: Socket) => {
  console.log('Client connected')
  // call to generate values
  generateBitcoinValues(io).then(() => console.log('Data Updated'))

  // Set interval to call generateBitcoinValues every 8 seconds
  const intervalId = setInterval(() => {
    generateBitcoinValues(io).then(() => console.log('Data Updated'))
  }, 8000)
  socket.on('disconnect', () => {
    console.log('Client disconnected')
    // Clear the interval when the client disconnects
    clearInterval(intervalId)
  })
})

// Start the server
server.listen(process.env.SERVER_PORT || 5173, () => {
  console.log(`🚀 Server listening at ${process.env.URL}`)
})

// Error event listener for the server
server.on('error', (err) => {
  console.error('Server error:', err)
  process.exit(1)
})
