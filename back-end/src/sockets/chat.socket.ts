import { Server, Socket } from 'socket.io'

import Chat from '~/models/chat.model'

export const chatSocketBrain = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('Một người dùng đã kết nối:', socket.id, 'với vai trò:', socket.data.role)

        if (socket.data.role === 'admin') {
            // Admin tham gia phòng (ADMIN_ROOM hoặc phòng của user)
            socket.on('ADMIN_CLIENT_JOIN_ROOM', (roomName: string) => {
                socket.join(roomName) // roomName có thể là 'ADMIN_ROOM' hoặc 1 user_id
                console.log(`Admin ${socket.data.adminId} đã tham gia phòng: ${roomName}`)
            })

            // Admin rời phòng
            socket.on('ADMIN_CLIENT_LEAVE_ROOM', (roomName: string) => {
                socket.leave(roomName)
                console.log(`Admin ${socket.data.adminId} đã rời phòng: ${roomName}`)
            })

            // Admin gửi tin nhắn
            socket.on('ADMIN_CLIENT_SEND_MESSAGE', async (data: { userId: string; content: string }) => {
                try {
                    const messageData = {
                        sender: 'admin' as 'user' | 'admin',
                        content: data.content,
                        createdAt: new Date()
                    }
                    
                    const chat = await Chat.findOneAndUpdate(
                        { user_id: data.userId },
                        { $push: { messages: messageData }, lastMessageAt: new Date() },
                        { upsert: true, new: true } // Không có thì tạo mới, có thì update – và luôn trả về dữ liệu mới nhất
                    ).populate('user_id')

                    const newMessage = chat.messages[chat.messages.length - 1]
                    const payload = { ...newMessage.toObject(), user_id: data.userId }

                    // Gửi tin nhắn real-time cho CLIENT (Client và Admin đều ở trong phòng này)
                    // io.to('ADMIN_ROOM').emit('SERVER_RECEIVE_MESSAGE', payload)

                    io.to(data.userId).emit('SERVER_RETURN_MESSAGE', payload)

                    // Gửi thông báo (để cập nhật danh sách lên đầu tiên, tức khi admin chat, tin nhắn nó sẽ update khi nhìn ở sidebar luôn)
                    io.to('ADMIN_ROOM').emit('NEW_MESSAGE_NOTIFICATION', { chatRoom: chat })
                } catch (error) {
                    console.error('Lỗi khi Admin gửi tin nhắn:', error)
                }
            })
        }

        if (socket.data.role === 'user') {
            const userId = socket.data.userId

            // Client tham gia phòng riêng của mình
            socket.on('USER_CLIENT_JOIN_ROOM', () => {
                socket.join(userId) // Join phòng có tên là user_id của họ
                console.log(`User ${userId} đã tham gia phòng chat.`)

                // Send confirmation back to client
                socket.emit('ROOM_JOINED', { userId, room: userId })
            })

            // Client gửi tin nhắn
            socket.on('USER_CLIENT_SEND_MESSAGE', async (content: string) => {
                try {
                    const messageData = {
                        sender: 'user' as 'user' | 'admin',
                        content: content,
                        createdAt: new Date()
                    }

                    const chat = await Chat.findOneAndUpdate(
                        { user_id: userId },
                        { $push: { messages: messageData }, lastMessageAt: new Date() },
                        { upsert: true, new: true }
                    ).populate('user_id')

                    // Lấy tin nhắn cuối cùng (có _id)
                    const newMessage = chat.messages[chat.messages.length - 1]
                    const payload = { ...newMessage.toObject(), user_id: userId }

                    // Gửi tin nhắn real-time cho CHÍNH CLIENT + Admin (Admin cũng ở trong phòng ADMIN_ROOM)
                    io.to(userId).emit('SERVER_RETURN_MESSAGE', payload)

                    // Gửi thông báo cho Admin (để cập nhật danh sách lên đầu tiên, tức khi user nhắn, tin nhắn sẽ hiển thị lên đầu ở sidebar và trong tin nhắn của user đó bên admin)
                    io.to('ADMIN_ROOM').emit('NEW_MESSAGE_NOTIFICATION', { chatRoom: chat })
                } catch (error) {
                    console.error('Lỗi khi Client gửi tin nhắn:', error)
                }
            })
        }

        socket.on('disconnect', () => {
            console.log('Người dùng đã ngắt kết nối:', socket.id)
        })
    })
}