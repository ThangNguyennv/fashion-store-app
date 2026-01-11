import { Link, Outlet } from 'react-router-dom'
import Footer from '~/components/client/footer/Footer'

const LayoutAuthClient = () => {
  return (
    <>
      <header className='py-6 md:py-12 flex items-center justify-center border-b'>
        <div className='container flex flex-wrap justify-center md:justify-between items-center gap-4 px-4'>
          <Link
            to={'/'}
            className='font-[500] hover:text-[#2F57EF] text-sm md:text-base text-center md:text-left'
          >
            LUXUES STORE / CỦA HÀNG THỜI TRANG ĐẸP - RẺ - CHẤT
          </Link>
          <Link
            to={'/help'}
            className='text-sm md:text-base font-[600] hover:underline cursor-pointer hover:text-[#525FE1]'
          >
            Bạn cần giúp đỡ?
          </Link>
        </div>
      </header>
      <Outlet />
      <Footer />
    </>
  )
}

export default LayoutAuthClient