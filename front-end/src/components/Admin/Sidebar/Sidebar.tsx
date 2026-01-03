import { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaMoneyBillWaveAlt, FaRegHandPeace } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { FaProductHunt } from 'react-icons/fa'
import { FaCodeBranch } from 'react-icons/fa'
import { MdArticle } from 'react-icons/md'
import { FaCriticalRole } from 'react-icons/fa'
import { MdOutlineSupervisorAccount } from 'react-icons/md'
import { IoIosSettings } from 'react-icons/io'
import { TbMenu4 } from 'react-icons/tb'
import { IoMenu } from 'react-icons/io5'
import { BsChatLeftText } from 'react-icons/bs'
import { useAuth } from '~/contexts/admin/AuthContext'
import { FcStatistics } from 'react-icons/fc'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenAccount, setIsOpenAccount] = useState(false)
  const [isOpenSetting, setIsOpenSetting] = useState(false)
  const [isOpenProduct, setIsOpenProduct] = useState(false)
  const [isOpenBranch, setIsOpenBranch] = useState(false)
  const [isOpenArticle, setIsOpenArticle] = useState(false)
  const [isOpenRole, setIsOpenRole] = useState(false)

  const { role } = useAuth()

  return (
    <div
      className={`
        ${isOpen ? 'w-[220px]' : 'w-[70px]'}
        flex flex-col gap-[20px] py-[30px]
        shadow:md bg-[#263544] px-[30px]
        text-[14px] font-[500] text-[#EFF2F2]
        h-screen fixed top-[66px] left-0 z-40
      `}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-center 
          mb-[10px] text-[18px] 
          ${isOpen ? 'justify-end' : 'justify-center'}
        `}
      >
        <span
          className={`
            transition-transform duration-400 ease-in-out
            ${isOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}
          `}
        >
          {isOpen ? <TbMenu4 /> : <IoMenu />}
        </span>
      </button>
      {/* Menu */}
      {isOpen ? (
        <>
          {/* <div
            className='hover-sidebar text-white cursor-pointer'
            onClick={() => setIsOpenStatistic(!isOpenStatistic)}
          >
            <div className='title-sidebar flex justify-between items-center p-[5px]'>
              <div className='flex items-center justify-start gap-[15px]'>
                <MdStatistic className='text-[18px]'/>
                <p>Tổng quan</p>
              </div>
              {isOpen && (
                <span>{isOpenStatistic ? <FaChevronUp /> : <FaChevronDown />}</span>
              )}
            </div>
            <div
              className={`
                overflow-hidden transition-all duration-700 ease-in-out
                ${isOpenStatistic ? 'max-h-40 mt-2' : 'max-h-0'}
              `}
            >
              <ul className="flex flex-col gap-2 items-center">
                <li className="border-b border-[#9D9995] pb-[7px]">
                  <Link to={'/admin/statistic'}>Thống kê</Link>
                </li>
                {role && role.permissions.includes('orders_view') && (
                  <li className="border-b border-[#9D9995] pb-[7px]">
                    <Link to={'/admin/orders'}>Danh sách đơn hàng</Link>
                  </li>
                )}
              </ul>
            </div>
          </div> */}

          {/* Trang xin chào */}
          <Link to={'/admin/admin-welcome'} className="hover-sidebar flex items-center justify-start gap-[15px] p-[5px]">
            <FaRegHandPeace className='text-[18px]'/>
            <span>Xin chào</span>
            {/* <BsChatLeftText className='text-[18px]'/> */}
          </Link>
          {/* Hết trang xin chào */}

          {/* Thống kê */}
          {role && role.permissions.includes('statistics_view') && (
            <Link to={'/admin/statistics'} className="hover-sidebar flex items-center justify-start gap-[15px] p-[5px]">
              <FcStatistics className='text-[18px]'/>
              <span>Thống kê</span>
              {/* <BsChatLeftText className='text-[18px]'/> */}
            </Link>
          )}
          {/* Hết thống kê */}

          {/* Danh sách đơn hàng */}
          {role && role.permissions.includes('orders_view') && (
            <Link to={'/admin/orders'} className="hover-sidebar flex items-center justify-start gap-[15px] p-[5px]">
              <FaMoneyBillWaveAlt className='text-[18px]'/>
              <span>Danh sách đơn hàng</span>
            </Link>
          )}

          {/* Hết danh sách đơn hàng */}

          {/* Sản phẩm */}
          {role && role.permissions.includes('products_view') && (
            <div
              className='hover-sidebar flex flex-col text-white cursor-pointer'
              onClick={() => setIsOpenProduct(!isOpenProduct)}
            >
              <div className='title-sidebar flex justify-between items-center p-[5px]'>
                <div className='flex items-center justify-start gap-[15px]'>
                  <FaProductHunt className='text-[18px]'/>
                  <p>Sản phẩm</p>
                </div>
                {isOpen && (
                  <span>{isOpenProduct ? <FaChevronUp /> : <FaChevronDown />}</span>
                )}
              </div>
              <div
                className={`
                  overflow-hidden transition-all duration-700 ease-in-out
                  ${isOpenProduct ? 'max-h-40 mt-2' : 'max-h-0'}
                `}
              >
                <ul className="flex flex-col gap-2 items-center">
                  <li className="border-b border-[#9D9995] pb-[7px]">
                    <Link to={'/admin/products-category'}>Danh mục sản phẩm</Link>
                  </li>
                  <li className="border-b border-[#9D9995] pb-[7px]">
                    <Link to={'/admin/products'}>Danh sách sản phẩm</Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {/* Hết sản phẩm */}

          {/* Thương hiệu */}
          {role && role.permissions.includes('brands_view') && role.permissions.includes('brands_view') && (
            <div
              className='hover-sidebar flex flex-col text-white cursor-pointer'
              onClick={() => setIsOpenBranch(!isOpenBranch)}
            >
              <div className='title-sidebar flex justify-between items-center p-[5px]'>
                <div className='flex items-center justify-start gap-[15px]'>
                  <FaCodeBranch className='text-[18px]'/>
                  <p>Thương hiệu</p>
                </div>
                {isOpen && (
                  <span>{isOpenBranch ? <FaChevronUp /> : <FaChevronDown />}</span>
                )}
              </div>
              <div
                className={`
                  overflow-hidden transition-all duration-700 ease-in-out
                  ${isOpenBranch ? 'max-h-40 mt-2' : 'max-h-0'}
                `}
              >
                <ul className="flex flex-col gap-2 items-center">
                  {/* <li className="border-b border-[#9D9995] pb-[7px]">
                    <Link to={'/admin/brands-category'}>Danh mục thương hiệu</Link>
                  </li> */}
                  <li className="border-b border-[#9D9995] pb-[7px]">
                    <Link to={'/admin/brands'}>Danh sách thương hiệu</Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {/* Hết thương hiệu */}

          {/* Bài viết */}
          {role && role.permissions.includes('articles-category_view') && role.permissions.includes('articles_view') && (
            <div
              className='hover-sidebar flex flex-col text-white cursor-pointer'
              onClick={() => setIsOpenArticle(!isOpenArticle)}
            >
              <div className='title-sidebar flex justify-between items-center p-[5px]'>
                <div className='flex items-center justify-start gap-[15px]'>
                  <MdArticle className='text-[18px]'/>
                  <p>Bài viết</p>
                </div>
                {isOpen && (
                  <span>{isOpenArticle ? <FaChevronUp /> : <FaChevronDown />}</span>
                )}
              </div>
              <div
                className={`
                  overflow-hidden transition-all duration-700 ease-in-out
                  ${isOpenArticle ? 'max-h-40 mt-2' : 'max-h-0'}
                `}
              >
                <ul className="flex flex-col gap-2 items-center">
                  <li className="border-b border-[#9D9995] pb-[7px]">
                    <Link to={'/admin/articles-category'}>Danh mục bài viết</Link>
                  </li>
                  <li className="border-b border-[#9D9995] pb-[7px]">
                    <Link to={'/admin/articles'}>Danh sách bài viết</Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {/* Hết bài viết */}

          {/* Quyền */}
          {role && role.permissions.includes('roles_view') && role.permissions.includes('roles_permissions') && (
            <div
              className='hover-sidebar flex flex-col text-white cursor-pointer'
              onClick={() => setIsOpenRole(!isOpenRole)}
            >
              <div className='title-sidebar flex justify-between items-center p-[5px]'>
                <div className='flex items-center justify-start gap-[15px]'>
                  <FaCriticalRole className='text-[18px]'/>
                  <p>Quyền</p>
                </div>
                {isOpen && (
                  <span>{isOpenRole ? <FaChevronUp /> : <FaChevronDown />}</span>
                )}
              </div>
              <div
                className={`
                  overflow-hidden transition-all duration-700 ease-in-out
                  ${isOpenRole ? 'max-h-40 mt-2' : 'max-h-0'}
                `}
              >
                <ul className="flex flex-col gap-2 items-center">
                  <li className="border-b border-[#9D9995] pb-[7px]">
                    <Link to={'/admin/roles'}>Nhóm quyền</Link>
                  </li>
                  <li className="border-b border-[#9D9995] pb-[7px]">
                    <Link to={'/admin/roles/permissions'}>Phân quyền</Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {/* Hết quyền */}

          {/* Tài khoản */}
          {role && role.permissions.includes('accounts_view') && role.permissions.includes('users_view') && (
            <div
              className='hover-sidebar flex flex-col text-white cursor-pointer'
              onClick={() => setIsOpenAccount(!isOpenAccount)}
            >
              <div className='title-sidebar flex justify-between items-center p-[5px]'>
                <div className='flex items-center justify-start gap-[15px]'>
                  <MdOutlineSupervisorAccount className='text-[18px]'/>
                  <p>Tài khoản</p>
                </div>
                {isOpen && (
                  <span>{isOpenAccount ? <FaChevronUp /> : <FaChevronDown />}</span>
                )}
              </div>
              <div
                className={`
                  overflow-hidden transition-all duration-700 ease-in-out
                  ${isOpenAccount ? 'max-h-40 mt-2' : 'max-h-0'}
                `}
              >
                <ul className="flex flex-col gap-2 items-center">
                  <li className="border-b border-[#9D9995] pb-[7px]">
                    <Link to={'/admin/accounts'}>Tài khoản Admin</Link>
                  </li>
                  <li className="border-b border-[#9D9995] pb-[7px]">
                    <Link to={'/admin/users'}>Tài khoản khách hàng</Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {/* Hết tài khoản */}

          {/* Cài đặt */}
          {role && role.permissions.includes('general_view') && (
            <div
              className='hover-sidebar flex flex-col text-white cursor-pointer'
              onClick={() => setIsOpenSetting(!isOpenSetting)}
            >
              <div className='title-sidebar flex justify-between items-center p-[5px]'>
                <div className='flex items-center justify-start gap-[15px]'>
                  <IoIosSettings className='text-[18px]'/>
                  <p>Cài đặt</p>
                </div>
                {isOpen && (
                  <span>{isOpenSetting ? <FaChevronUp /> : <FaChevronDown />}</span>
                )}
              </div>
              <div
                className={`
                  overflow-hidden transition-all duration-700 ease-in-out
                  ${isOpenSetting ? 'max-h-40 mt-2' : 'max-h-0'}
                `}
              >
                <ul className="flex flex-col gap-2 items-center">
                  <li className="border-b border-[#9D9995] pb-[7px]">
                    <Link to={'/admin/settings/general'}>Cài đặt chung</Link>
                  </li>
                  <li className="border-b border-[#9D9995] pb-[7px]">
                    <Link to={'/admin/settings/advance'}>Cài đặt nâng cao</Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {/* Hết cài đặt */}

          {/* Chat */}
          <Link to={'/admin/chats'} className="hover-sidebar flex items-center justify-start gap-[15px] p-[5px]">
            <BsChatLeftText className='text-[18px]'/>
            {isOpen && (
              <span>Chat khách hàng</span>
            )}
            {/* <BsChatLeftText className='text-[18px]'/> */}
          </Link>
          {/* Hết chat */}
        </>
      ) : (
        <>
          <div className='flex flex-col text-[18px] gap-[35px] items-center justify-center'>
            <FaRegHandPeace />
            {role && (
              <>
                {role.permissions.includes('statistics_view') && (
                  <FcStatistics />
                )}
                {role.permissions.includes('orders_view') && (
                  <FaMoneyBillWaveAlt />
                )}
                {role.permissions.includes('products-category_view') && role.permissions.includes('products_view') && (
                  <FaProductHunt />
                )}
                {role.permissions.includes('brands_view') && (
                  <FaCodeBranch />
                )}
                {role.permissions.includes('articles-category_view') && role.permissions.includes('articles_view') && (
                  <MdArticle />
                )}
                {role.permissions.includes('roles_view') && role.permissions.includes('roles_permissions') && (
                  <FaCriticalRole />
                )}
                {role.permissions.includes('accounts_view') && role.permissions.includes('users_view') && (
                  <MdOutlineSupervisorAccount />
                )}
                {role.permissions.includes('general_view') && (
                  <IoIosSettings />
                )}
                <BsChatLeftText />
              </>
            )}
          </div>
        </>
      )}
      {/* Hết menu */}
    </div>
  )
}

export default Sidebar