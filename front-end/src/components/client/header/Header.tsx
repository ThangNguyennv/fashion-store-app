import { IoIosNotifications, IoMdClose } from 'react-icons/io'
import { IoSearch } from 'react-icons/io5'
import { IoMdCart } from 'react-icons/io'
import { FaRegUserCircle } from 'react-icons/fa'
import { FaBars } from 'react-icons/fa'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Link } from 'react-router-dom'
import { IoLogOutOutline } from 'react-icons/io5'
import { CgProfile } from 'react-icons/cg'
import { IoIosLogIn } from 'react-icons/io'
import { FaRegRegistered } from 'react-icons/fa'
import SubMenu from '../subMenu/SubMenu'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronDown } from 'react-icons/io5'
import { RiBillLine } from 'react-icons/ri'
import SearchInput from './SearchInput'
import useHeader from '~/hooks/client/header/useHeader'
import SubMenuArticle from '../subMenuArticlee/SubMenuArticle'

const Header = () => {
  const {
    accountUser,
    closeTopHeader,
    handleCloseTopHeader,
    settingGeneral,
    setOpenProduct,
    openProduct,
    dataHome,
    setOpenArticle,
    handleSearchSubmit,
    handleSearchTermChange,
    openArticle,
    suggestions,
    scrollContainerRef,
    visibleCount,
    setSuggestions,
    isSuggestLoading,
    handleShowMore,
    cartDetail,
    handleOpen,
    handleClose,
    anchorEl,
    setAnchorEl,
    handleLogout,
    isMobileMenuOpen,
    isMobileSearchOpen,
    toggleMobileMenu,
    toggleMobileSearch,
    searchTerm
  } = useHeader()

  return (
    <>
      {/* Top header */}
      {!accountUser && (
        <div className={`bg-primary sm:py-[8px] py-[7px] ${closeTopHeader ? 'hidden' : 'block'}`}>
          <div className="container mx-auto px-[16px]">
            <div className="flex">
              <div className="text-white flex-1 text-center sm:text-[14px] text-[12px]">
                <span className="font-[400]">Đăng ký để được giảm giá 20%.</span>
                <Link
                  className="font-[500] hover:underline ml-[5px]"
                  to="/user/register"
                >
                  Đăng Ký Ngay
                </Link>
              </div>
              <button
                onClick={handleCloseTopHeader}
                className="text-white text-[14px] sm:inline-block hidden cursor-pointer"
              >
                <IoMdClose />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sm:py-[24px] py-[19px] sticky top-0 bg-[#96D5FE] backdrop-blur-[45px] z-[999]">
        <div className="container mx-auto px-[16px]">
          <div className="flex items-center justify-between 2xl:gap-x-[35px]">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="text-[20px] lg:hidden inline"
              aria-label="Toggle menu"
            >
              <FaBars />
            </button>

            {/* Logo */}
            <Link
              className="flex items-center justify-center gap-[4px] font-[700] sm:text-[30px] text-[27px] text-primary lg:flex-none flex-1"
              to={'/'}
            >
              {settingGeneral && (
                <>
                  <img
                    alt="logo"
                    src={settingGeneral[0].logo}
                    className='w-[60px] h-[60px] bg-amber-900 object-cover'
                  />
                  <span className='uppercase flex flex-col items-center'>
                    <p className='text-[#00171F] text-[20px] sm:text-[30px]' style={{ textShadow: '2px 2px 5px rgba(0,0,0,0.5)' }}>
                      {settingGeneral[0].websiteName}
                    </p>
                    <p className='text-[8px] sm:text-[10px] font-bold text-[#0A033C]' style={{ textShadow: '2px 2px 5px rgba(0,0,0,0.5)' }}>
                      Lịch lãm - Sang trọng - Quý phái
                    </p>
                  </span>
                </>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="lg:block hidden">
              <ul className="menu flex xl:gap-x-[17px] gap-x-[10px] font-[400] lg:text-[16px] text-[13px] text-black">
                <li>
                  <Link to="/">Trang chủ</Link>
                </li>
                <li
                  className='relative'
                  onMouseEnter={() => setOpenProduct(true)}
                  onMouseLeave={() => setOpenProduct(false)}
                >
                  <Link to={'/products'} className='flex items-center 2xl:gap-[5px] gap-0'>
                    <span>Sản phẩm</span>
                    <IoChevronDown />
                  </Link>
                  {openProduct && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="
                        absolute 2xl:top-[20px] 2xl:left-[-410px] 2xl:p-[12px] 2xl:w-[1527px] z-[999]
                        xl:top-[20px] xl:left-[-530px] xl:p-[12px] xl:w-[1160px]
                        lg:top-[20px] lg:left-[-450px] lg:p-[12px] lg:w-[1000px]
                      ">
                        {dataHome && dataHome.productCategories && (
                          <SubMenu
                            dataDropdown={
                              dataHome.productCategories.map((category) => ({
                                ...category,
                                _id: category._id ?? '',
                                slug: category.slug ?? '',
                                children: category.children
                                  ? category.children.map((sub) => ({
                                    ...sub,
                                    _id: sub._id ?? '',
                                    slug: sub.slug ?? '',
                                    children: sub.children
                                      ? sub.children.map((child) => ({
                                        ...child,
                                        _id: child._id ?? '',
                                        slug: child.slug ?? ''
                                      }))
                                      : undefined
                                  }))
                                  : undefined
                              }))
                            }
                            items={'products'}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </li>
                <li>
                  <Link to={'/brands'} className='flex items-center gap-[5px]'>
                    <span>Thương hiệu</span>
                    <IoChevronDown />
                  </Link>
                </li>
                <li
                  className='relative'
                  onMouseEnter={() => setOpenArticle(true)}
                  onMouseLeave={() => setOpenArticle(false)}
                >
                  <Link to={'/articles'} className='flex items-center gap-[5px]'>
                    <span>Bài Viết</span>
                    <IoChevronDown />
                  </Link>
                  {openArticle && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="absolute 2xl:top-[20px] 2xl:left-[-100px] 2xl:p-[12px] 2xl:w-[310px] z-[999]
                        xl:top-[20px] xl:left-[-110px] xl:p-[12px] xl:w-[310px]
                        lg:top-[20px] lg:left-[-110px] lg:p-[12px] lg:w-[310px]">
                        {dataHome && dataHome.articleCategories && (
                          <SubMenuArticle
                            dataDropdown={
                              dataHome.articleCategories.map((category) => ({
                                ...category,
                                _id: category._id ?? '',
                                slug: category.slug ?? '',
                                children: category.children
                                  ? category.children.map((sub) => ({
                                    ...sub,
                                    _id: sub._id ?? '',
                                    slug: sub.slug ?? '',
                                    children: sub.children
                                      ? sub.children.map((child) => ({
                                        ...child,
                                        _id: child._id ?? '',
                                        slug: child.slug ?? ''
                                      }))
                                      : undefined
                                  }))
                                  : undefined
                              }))
                            }
                            items={'articles'}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </li>
              </ul>
            </nav>

            {/* Desktop Search */}
            <div className="relative flex-1 2xl:flex hidden">
              <SearchInput
                onSearchSubmit={handleSearchSubmit}
                onTermChange={handleSearchTermChange}
                inputValue={searchTerm}
              />

              {suggestions.length > 0 && (
                <div
                  ref={scrollContainerRef}
                  className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-[1000] p-4 max-h-[400px] overflow-y-auto"
                >
                  <div className="flex flex-col gap-4">
                    {suggestions.slice(0, visibleCount).map(product => (
                      <Link
                        to={`/products/detail/${product.slug}`}
                        key={product._id}
                        className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-md"
                        onClick={() => setSuggestions([])}
                      >
                        <img src={product.thumbnail} alt={product.title} className="w-16 h-16 object-contain border rounded" />
                        <div className="flex-1">
                          <p className="font-semibold line-clamp-2">{product.title}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-red-600 font-bold">
                              {Math.floor((product.price * (100 - product.discountPercentage)) / 100).toLocaleString('vi-VN')}đ
                            </span>
                            <span className="line-through text-gray-500">
                              {product.price.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {isSuggestLoading && <p className="text-center p-2">Đang tải...</p>}

                  {visibleCount < suggestions.length && (
                    <div className="text-center mt-4">
                      <button
                        type='button'
                        onClick={handleShowMore}
                        className="text-blue-600 hover:underline"
                      >
                        Xem thêm {Math.min(4, suggestions.length - visibleCount)} sản phẩm
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Icons */}
            <div className="flex items-center xl:gap-x-[20px] gap-x-[15px] text-[26px]">
              {/* Mobile Search Button */}
              <button
                onClick={toggleMobileSearch}
                className="2xl:hidden inline hover:text-[#00A7E6] transition-colors"
                aria-label="Toggle search"
              >
                <IoSearch />
              </button>

              <a href='#'>
                <IoIosNotifications className='hover:text-[#00A7E6]'/>
              </a>

              <Link to={'/cart'} className='relative'>
                <IoMdCart className='hover:text-[#00A7E6]'/>
                {cartDetail && cartDetail.products.length > 0 && (
                  <div className='absolute border rounded-[15px] text-center text-[13px] px-[5px] right-[-10px] top-[-10px] bg-amber-50'>
                    {cartDetail.products.length}
                  </div>
                )}
              </Link>

              {/* User Menu */}
              {accountUser ? (
                <div
                  onMouseEnter={(event) => handleOpen(event)}
                  onMouseLeave={handleClose}
                  className='md:flex hidden items-center justify-center gap-[5px]'
                >
                  <img src={accountUser.avatar} alt='Avatar' className='border rounded-[50%] w-[40px] h-[40px] object-cover'/>
                  <span className='text-[20px]'>{accountUser.fullName}</span>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    slotProps={{
                      paper: {
                        onMouseEnter: () => setAnchorEl(anchorEl),
                        onMouseLeave: handleClose
                      }
                    }}
                  >
                    <MenuItem sx={{
                      '&:hover': {
                        backgroundColor: '#E0F2FE',
                        color: '#00A7E6'
                      }
                    }}>
                      <Link to={'/user/account/info'} className='flex items-center justify-start gap-[10px]'>
                        <CgProfile />
                        <span>Tài khoản của tôi</span>
                      </Link>
                    </MenuItem>
                    <MenuItem sx={{
                      '&:hover': {
                        backgroundColor: '#E0F2FE',
                        color: '#00A7E6'
                      }
                    }}>
                      <Link to={'/user/my-orders'} className='flex items-center justify-start gap-[10px]'>
                        <RiBillLine />
                        <span>Đơn mua</span>
                      </Link>
                    </MenuItem>
                    <MenuItem sx={{
                      '&:hover': {
                        backgroundColor: '#E0F2FE',
                        color: '#00A7E6'
                      }
                    }}>
                      <div onClick={handleLogout} className='flex items-center justify-start gap-[10px]'>
                        <IoLogOutOutline />
                        <span>Đăng xuất</span>
                      </div>
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                <div
                  onMouseEnter={(event) => handleOpen(event)}
                  onMouseLeave={handleClose}
                  className='md:flex hidden items-center justify-center gap-[5px]'
                >
                  <FaRegUserCircle />
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    slotProps={{
                      paper: {
                        onMouseEnter: () => setAnchorEl(anchorEl),
                        onMouseLeave: handleClose
                      }
                    }}
                  >
                    <MenuItem sx={{
                      '&:hover': {
                        backgroundColor: '#E0F2FE',
                        color: '#00A7E6'
                      }
                    }}>
                      <Link to={'/user/login'} className='flex items-center justify-start gap-[10px]'>
                        <IoIosLogIn />
                        <span>Đăng nhập</span>
                      </Link>
                    </MenuItem>
                    <MenuItem sx={{
                      '&:hover': {
                        backgroundColor: '#E0F2FE',
                        color: '#00A7E6'
                      }
                    }}>
                      <Link to={'/user/register'} className='flex items-center justify-start gap-[10px]'>
                        <FaRegRegistered />
                        <span>Đăng ký</span>
                      </Link>
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-white z-[9999] lg:hidden overflow-y-auto"
          >
            <div className="p-4">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Menu</h2>
                <button
                  onClick={toggleMobileMenu}
                  className="text-2xl"
                  aria-label="Close menu"
                >
                  <IoMdClose />
                </button>
              </div>

              {/* User Info Mobile */}
              {accountUser && (
                <div className="flex items-center gap-3 p-4 bg-[#E0F2FE] rounded-lg mb-4">
                  <img src={accountUser.avatar} alt='Avatar' className='border rounded-full w-12 h-12 object-cover'/>
                  <span className='text-[16px] font-semibold'>{accountUser.fullName}</span>
                </div>
              )}

              {/* Mobile Navigation */}
              <nav>
                <ul className="flex flex-col gap-2 text-[16px]">
                  <li>
                    <Link
                      to="/"
                      onClick={toggleMobileMenu}
                      className="block py-3 px-4 hover:bg-[#E0F2FE] rounded-lg"
                    >
                      Trang chủ
                    </Link>
                  </li>

                  {/* Products with dropdown */}
                  <li>
                    {dataHome && dataHome.productCategories && dataHome.productCategories.length > 0 && (
                      <SubMenu
                        dataDropdown={
                          dataHome.productCategories.map((category) => ({
                            ...category,
                            _id: category._id ?? '',
                            slug: category.slug ?? '',
                            children: category.children
                              ? category.children.map((sub) => ({
                                ...sub,
                                _id: sub._id ?? '',
                                slug: sub.slug ?? '',
                                children: sub.children
                                  ? sub.children.map((child) => ({
                                    ...child,
                                    _id: child._id ?? '',
                                    slug: child.slug ?? ''
                                  }))
                                  : undefined
                              }))
                              : undefined
                          }))
                        }
                        items={'products'}
                        isMobile={true}
                        onLinkClick={toggleMobileMenu}
                        showParentLink={true} // Bật main parent
                        parentLinkPath={'/products'} // Link chính
                        parentLinkText="Sản phẩm" // Text hiển thị
                      />
                    )}
                  </li>

                  <li>
                    <Link
                      to={'/brands'}
                      onClick={toggleMobileMenu}
                      className="block py-3 px-4 hover:bg-[#E0F2FE] rounded-lg"
                    >
                      Thương hiệu
                    </Link>
                  </li>

                  {/* Articles with dropdown */}
                  <li>
                    {dataHome && dataHome.articleCategories && dataHome.articleCategories.length > 0 && (
                      <SubMenuArticle
                        dataDropdown={
                          dataHome.articleCategories.map((category) => ({
                            ...category,
                            _id: category._id ?? '',
                            slug: category.slug ?? '',
                            children: category.children
                              ? category.children.map((sub) => ({
                                ...sub,
                                _id: sub._id ?? '',
                                slug: sub.slug ?? '',
                                children: sub.children
                                  ? sub.children.map((child) => ({
                                    ...child,
                                    _id: child._id ?? '',
                                    slug: child.slug ?? ''
                                  }))
                                  : undefined
                              }))
                              : undefined
                          }))
                        }
                        items={'articles'}
                        isMobile={true}
                        onLinkClick={toggleMobileMenu}
                        showParentLink={true} // Bật main parent
                        parentLinkPath={'/articles'}
                        parentLinkText="bài viết"
                      />
                    ) }
                  </li>

                  {/* User Actions Mobile */}
                  {accountUser ? (
                    <>
                      <li className="border-t pt-4">
                        <Link
                          to={'/user/account/info'}
                          onClick={toggleMobileMenu}
                          className="flex items-center gap-3 py-3 px-4 hover:bg-[#E0F2FE] rounded-lg"
                        >
                          <CgProfile className="text-xl" />
                          <span>Tài khoản của tôi</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={'/user/my-orders'}
                          onClick={toggleMobileMenu}
                          className="flex items-center gap-3 py-3 px-4 hover:bg-[#E0F2FE] rounded-lg"
                        >
                          <RiBillLine className="text-xl" />
                          <span>Đơn mua</span>
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            handleLogout()
                            toggleMobileMenu()
                          }}
                          className="flex items-center gap-3 py-3 px-4 hover:bg-[#E0F2FE] rounded-lg w-full text-left"
                        >
                          <IoLogOutOutline className="text-xl" />
                          <span>Đăng xuất</span>
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="border-t pt-4">
                        <Link
                          to={'/user/login'}
                          onClick={toggleMobileMenu}
                          className="flex items-center gap-3 py-3 px-4 hover:bg-[#E0F2FE] rounded-lg"
                        >
                          <IoIosLogIn className="text-xl" />
                          <span>Đăng nhập</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={'/user/register'}
                          onClick={toggleMobileMenu}
                          className="flex items-center gap-3 py-3 px-4 hover:bg-[#E0F2FE] rounded-lg"
                        >
                          <FaRegRegistered className="text-xl" />
                          <span>Đăng ký</span>
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 bg-white z-[9999] 2xl:hidden shadow-lg"
          >
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={toggleMobileSearch}
                  className="text-2xl"
                  aria-label="Close search"
                >
                  <IoMdClose />
                </button>
                <SearchInput
                  onSearchSubmit={handleSearchSubmit}
                  onTermChange={handleSearchTermChange}
                  inputValue={searchTerm}
                  isMobile={true}
                />
              </div>

              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <div
                  ref={scrollContainerRef}
                  className="max-h-[calc(100vh-120px)] overflow-y-auto"
                >
                  <div className="flex flex-col gap-3">
                    {suggestions.slice(0, visibleCount).map(product => (
                      <Link
                        to={`/products/detail/${product.slug}`}
                        key={product._id}
                        className="flex items-center gap-3 hover:bg-gray-100 p-3 rounded-md"
                        onClick={() => {
                          setSuggestions([])
                          toggleMobileSearch()
                        }}
                      >
                        <img src={product.thumbnail} alt={product.title} className="w-14 h-14 object-contain border rounded" />
                        <div className="flex-1">
                          <p className="font-semibold line-clamp-2 text-sm">{product.title}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-red-600 font-bold">
                              {Math.floor((product.price * (100 - product.discountPercentage)) / 100).toLocaleString('vi-VN')}đ
                            </span>
                            <span className="line-through text-gray-500">
                              {product.price.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {isSuggestLoading && <p className="text-center p-2">Đang tải...</p>}

                  {visibleCount < suggestions.length && (
                    <div className="text-center mt-4">
                      <button
                        type='button'
                        onClick={handleShowMore}
                        className="text-blue-600 hover:underline"
                      >
                        Xem thêm {Math.min(4, suggestions.length - visibleCount)} sản phẩm
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header