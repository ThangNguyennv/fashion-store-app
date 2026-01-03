import { motion, AnimatePresence } from 'framer-motion'
import { IoMdClose } from 'react-icons/io'
import { BsChatDotsFill } from 'react-icons/bs'
import { IoIosSend } from 'react-icons/io'
import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'
import useChat from '~/hooks/client/chat/useChat'

const ChatPage = () => {
  const {
    setIsOpen,
    handleSubmit,
    loading,
    isOpen,
    accountUser,
    messages,
    messagesEndRef,
    newMessage,
    setNewMessage
  } = useChat()

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-[999] hover:bg-blue-700 transition-transform hover:scale-110"
        aria-label="Mở chat"
      >
        <BsChatDotsFill size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed bottom-[calc(4.5rem+1.5rem)] right-6 w-full max-w-sm h-[500px] bg-white rounded-lg shadow-xl z-[1000] flex flex-col overflow-hidden"
          >
            <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold">Hỗ trợ trực tuyến</h3>
              <button onClick={() => setIsOpen(false)} aria-label="Đóng chat">
                <IoMdClose size={24} />
              </button>
            </header>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {/* Logic hiển thị 3 trạng thái */}
              {!accountUser ? (
                // Trạng thái: Chưa đăng nhập
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
                  <p className="mb-4">
                    Vui lòng<Link to="/user/login" className="text-blue-600 font-semibold underline">đăng nhập</Link>để bắt đầu trò chuyện.
                  </p>
                  <p className="text-xs">Việc đăng nhập giúp chúng tôi hỗ trợ bạn tốt hơn.</p>
                </div>
              ) : loading ? (
                // Trạng thái: Đang tải (đã đăng nhập)
                <div className="space-y-4">
                  <Skeleton variant="rounded" width="60%" height={40} />
                  <Skeleton variant="rounded" width="70%" height={50} sx={{ ml: 'auto' }} />
                  <Skeleton variant="rounded" width="50%" height={40} />
                </div>
              ) : (
                // Trạng thái: Đã tải xong, sẵn sàng chat
                messages.map((msg, index) => (
                  <div
                    key={msg._id || index}
                    className={`flex my-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={accountUser ? 'Nhập tin nhắn...' : 'Bạn cần đăng nhập để chat'}
                className="flex-1 border rounded-full py-2 px-4 outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading || !accountUser} // Vô hiệu hóa nếu đang tải hoặc chưa login
              />
              <button
                type="submit"
                className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center disabled:bg-gray-400"
                disabled={loading || !newMessage.trim() || !accountUser}
              >
                <IoIosSend />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatPage

