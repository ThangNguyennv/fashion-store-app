import { Outlet } from 'react-router-dom'
import Header from '~/components/admin/header/Header'
import Sidebar from '~/components/admin/sidebar/Sidebar'

const LayoutDefaultAdmin = () => {
  return (
    <>
      <Header />
      <div className='flex bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 bg-cover min-h-screen'>
        <Sidebar />
        <div className='flex justify-center flex-1 ml-[130px] my-[75px]'>
          <div className='container flex flex-col'>
            <Outlet />
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  )
}

export default LayoutDefaultAdmin