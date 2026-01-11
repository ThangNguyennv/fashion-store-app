import { IoIosReturnRight } from 'react-icons/io'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
  return (
    <>
      <div className="w-screen h-screen bg-[#252733] p-[25px] text-[#ECECEC] flex items-center justify-center">
        <div className='login-admin flex flex-col gap-[15px] border rounded-[15px] border-[#231F40] p-[25px] bg-[#00171F]'>
          <span>Vui lòng liên hệ quản trị viên để lấy lại mật khẩu. Xin cảm ơn!</span>
          <div className='flex items-center justify-start'>
            <Link to={'/admin/auth/login'} className="nav-link border rounded-[5px] p-[7px] flex items-center justify-center gap-[5px] bg-[#525FE1] text-white">
              <IoIosReturnRight className="text-[15px]"/>
              <span className='text-[14px]'>Quay trở lại</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword