import { Link } from 'react-router-dom'
import { useHeader } from '~/hooks/admin/header/useHeader'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { IoIosLogOut, IoIosNotificationsOutline } from 'react-icons/io'
import Skeleton from '@mui/material/Skeleton'
import logo from '~/assets/images/Header/logo.jpg'
import { CgProfile } from 'react-icons/cg'
import { IoSettingsOutline } from 'react-icons/io5'

const Header = () => {
  const {
    myAccount,
    handleLogout,
    handleOpen,
    handleClose,
    anchorEl,
    setAnchorEl,
    role
  } = useHeader()

  return (
    <>
      {myAccount ? (
        <>
          <header className="
            bg-[#252733] py-[13px] px-[30px]
            text-[25px] font-[700] text-[#EFF2F2]
            flex items-center justify-between
            fixed top-0 left-0 right-0
            w-full z-50 shadow-md
            "
          >
            <Link to={'/admin/admin-welcome'} className='flex items-center justify-center gap-[10px]'>
              <img src={logo} className='contain w-[40px] h-[40px]'/>
              <p className='uppercase'>ADMIN</p>
            </Link>
            <div className='flex items-center justify-between gap-[25px]'>
              <Link to={'/admin/notification'} className='hover:text-green-600'>
                <IoIosNotificationsOutline />
              </Link>
              <Link
                to={'/admin/my-account'}
                onMouseEnter={(event) => handleOpen(event)}
                onMouseLeave={handleClose}
                className='flex items-center justify-center gap-[10px]'
              >
                <div className='flex items-center justify-center gap-[8px] cursor-pointer'>
                  <img
                    src={myAccount.avatar}
                    className='border rounded-[50%] w-[40px] h-[40px] object-cover'
                  />
                  <span>{myAccount.fullName}</span>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    slotProps={{
                      paper: {
                        onMouseEnter: () => setAnchorEl(anchorEl), // giữ menu khi hover
                        onMouseLeave: handleClose // rời ra thì đóng
                      }
                    }}
                  >
                    <MenuItem sx={{
                      '&:hover': {
                        backgroundColor: '#E0F2FE',
                        color: '#00A7E6'
                      }
                    }}>
                      <Link to={'/admin/my-account'} className='flex items-center justify-start gap-[10px] w-full'>
                        <CgProfile />
                        <span>Hồ sơ</span>
                      </Link>
                    </MenuItem>
                    {role && role.permissions.includes('settings-general_view') && (
                      <MenuItem sx={{
                        '&:hover': {
                          backgroundColor: '#E0F2FE',
                          color: '#00A7E6'
                        }
                      }}>

                        <Link to={'/admin/settings/general'} className='flex items-center justify-start gap-[10px] w-full'>
                          <IoSettingsOutline />
                          <span>Cài đặt</span>
                        </Link>
                      </MenuItem>
                    )}
                    <MenuItem sx={{
                      '&:hover': {
                        backgroundColor: '#E0F2FE',
                        color: '#00A7E6'
                      }
                    }}>
                      <button onClick={handleLogout} className='flex items-center justify-start gap-[10px] w-full'>
                        <IoIosLogOut />
                        <span>Đăng xuất</span>
                      </button>
                    </MenuItem>
                  </Menu>
                </div>
              </Link>
            </div>
          </header>
        </>
      ) : (
        <>
          <header className="
            bg-[#00171F] p-[20px]
            text-[25px] font-[700] text-[#EFF2F2]
            flex items-center justify-between
            fixed top-0 left-0 right-0
            w-full z-50 shadow-md
            "
          >
            <Skeleton variant="text" width={81} height={38} sx={{ bgcolor: 'grey.400' }}/>
            <div className='flex items-center justify-between gap-[25px]'>
              <Skeleton variant="circular" width={25} height={25} sx={{ bgcolor: 'grey.400' }}/>
              <div
                className='flex items-center justify-center gap-[10px]'
              >
                <div className='flex items-center justify-center gap-[8px] cursor-pointer'>
                  <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'grey.400' }}/>
                  <Skeleton variant="text" width={113} height={38} sx={{ bgcolor: 'grey.400' }}/>
                </div>
              </div>
            </div>
          </header>
        </>
      )}
    </>
  )
}

export default Header