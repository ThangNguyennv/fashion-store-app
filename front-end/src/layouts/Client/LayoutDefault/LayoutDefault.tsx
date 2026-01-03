import { Outlet } from 'react-router-dom'
import Header from '~/components/Client/Header/Header'
import Footer from '~/components/Client/Footer/Footer'
import ChatPage from '~/pages/Client/Chat/ChatPage'

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