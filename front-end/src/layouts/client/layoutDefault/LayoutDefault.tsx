import { Outlet } from 'react-router-dom'
import Header from '~/components/client/header/Header'
import Footer from '~/components/client/footer/Footer'
import ChatPage from '~/pages/client/chat/ChatPage'

const LayoutDefaultClient = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ChatPage />
    </>
  )
}

export default LayoutDefaultClient