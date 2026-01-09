import express, { Express } from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import http from 'http'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
dotenv.config()
import cors from 'cors'
import * as database from './src/config/database'
import systemConfig from './src/config/system'
import routeClient from './src/routes/client/index.route'
import routeAdmin from './src/routes/admin/index.route'
import { chatSocket } from './src/middlewares/sockets/chatSocket.middleware'
import { chatSocketBrain } from '~/sockets/chat.socket'

database.connect()

const app: Express = express()
const port: number | string = process.env.PORT

// Dùng biến môi trường và cho phép cả local + production
const allowedOrigins = [
  process.env.CLIENT_URL,
].filter(Boolean) // Loại bỏ undefined

app.use(cors({
  origin: allowedOrigins, // FE origin
  credentials: true, // Cho phép gửi cookie từ FE
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],     // Các phương thức HTTP được phép
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control']   // Cho phép các header cần thiết
}))

// Socket IO
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Cho phép client React kết nối
    credentials: true // Cho phép gửi cookie từ FE
  }
})

global._io = io
// MIDDLEWARE XÁC THỰC CHO SOCKET.IO
chatSocket(io)
  
// LOGIC XỬ LÝ CHAT REAL-TIME
chatSocketBrain(io)
// End Socket IO

// Parse JSON bodies
app.use(bodyParser.json())

app.use(cookieParser('dfdfsadasd'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,         // khuyến nghị: không lưu lại nếu session chưa thay đổi
  saveUninitialized: false, // khuyến nghị: không tạo session trống
  cookie: { maxAge: 60000 }
}))

// Tinymce
app.use(
  '/tinymce',
  express.static(path.join(__dirname, 'node_modules', 'tinymce'))
)
// End Tinymce

// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin

// giúp Express phục vụ các file tĩnh trong thư mục public mà không cần viết route thủ công.
app.use(express.static(`${__dirname}/public`)) 

routeAdmin(app)
routeClient(app)

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}`)
})
