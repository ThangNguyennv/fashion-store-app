import { useState } from 'react'
import { BsCoin } from 'react-icons/bs'
import { FaChevronDown, FaChevronUp, FaRegUser } from 'react-icons/fa'
import { IoIosNotifications } from 'react-icons/io'
import { LiaFileInvoiceSolid } from 'react-icons/lia'
import { LuTicket } from 'react-icons/lu'
import { Link, Outlet } from 'react-router-dom'

const LayoutUser = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="flex justify-center pb-[70px] mt-[20px] md:mt-[40px] mb-[80px] px-4 md:px-0">

        <div className="
            container mx-auto
            flex flex-col lg:flex-row
            gap-[20px]
            shadow-lg rounded-lg overflow-hidden
            bg-white
        ">

          <div className='
              flex flex-col gap-[5px]
              text-[17px] font-[500]
              p-[20px]
              w-full lg:w-[250px] flex-shrink-0 /* Mobile full width, Desktop cố định 250px */
              border-b lg:border-b-0 lg:border-r /* Mobile gạch dưới, Desktop gạch phải */
          '>
            <div className='hover:underline hover:text-[#00A7E6] cursor-pointer flex items-center gap-[4px] py-2'>
              <IoIosNotifications size={20} />
              <p>Thông Báo</p>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className='flex items-center gap-[5px] cursor-pointer py-2 justify-between lg:justify-start'
            >
              <div className="flex items-center gap-[5px]">
                <FaRegUser size={18} />
                <span className='hover:underline hover:text-[#00A7E6]'>Tài Khoản Của Tôi</span>
              </div>
              <span>{isOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}</span>
            </button>

            <div className={`
                  overflow-hidden transition-all duration-300
                  ${isOpen ? 'max-h-60 mt-2' : 'max-h-0'}
                `}
            >
              <ul className='flex flex-col gap-3 ml-[28px] text-[15px] text-gray-600'>
                <li className='hover:underline hover:text-[#00A7E6] cursor-pointer'>
                  <Link to={'/user/account/info'}>Hồ sơ</Link>
                </li>
                <li className='hover:underline hover:text-[#00A7E6] cursor-pointer'>Ngân hàng</li>
                <li className='hover:underline hover:text-[#00A7E6] cursor-pointer'>Địa chỉ</li>
                <li className='hover:underline hover:text-[#00A7E6] cursor-pointer'>
                  <Link to={'/user/account/info/change-password'}>Đổi mật khẩu</Link>
                </li>
                <li className='hover:underline hover:text-[#00A7E6] cursor-pointer'>Những thiết lập riêng</li>
              </ul>
            </div>

            <div className='hover:underline hover:text-[#00A7E6] cursor-pointer flex items-center gap-[5px] py-2'>
              <LiaFileInvoiceSolid size={20}/>
              <Link to={'/user/my-orders'}>Đơn Mua</Link>
            </div>
            <div className='hover:underline hover:text-[#00A7E6] cursor-pointer flex items-center gap-[5px] py-2'>
              <LuTicket size={20}/>
              Kho Voucher
            </div>
            <div className='hover:underline hover:text-[#00A7E6] cursor-pointer flex items-center gap-[5px] py-2'>
              <BsCoin size={20}/>
              Luxues Xu
            </div>
          </div>

          <div className="flex-1 p-[20px] overflow-x-hidden">
            <Outlet />
          </div>

        </div>
      </div>
    </>
  )
}

export default LayoutUser