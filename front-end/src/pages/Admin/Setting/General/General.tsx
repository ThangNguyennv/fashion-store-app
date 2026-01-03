import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'
import useSettingsGeneral from '~/hooks/Admin/settingsGeneral/useSettingsGeneral'

const General = () => {
  const {
    general,
    role
  } = useSettingsGeneral()

  return (
    <>
      {role && role.permissions.includes('settings-general_view') && (
        general ? (
          <div className='flex flex-col gap-[15px] mt-[20px] w-[50%] bg-[#FFFFFF] py-[15px] pl-[50px] shadow-md text-[17px]'>
            <h1 className='text-[24px] font-[700]'>Cài đặt chung</h1>
            <div>
              <b>Tên website: </b>
              <span className='text-[16px]'>{general.websiteName}</span>
            </div>
            <div className='flex flex-col gap-[10px]'>
              <b>Logo: </b>
              <img
                src={general.logo}
                className='w-[150px] h-auto'
              />
            </div>
            <div>
              <b>Số điện thoại: </b>
              <span className='text-[16px]'>{general.phone}</span>
            </div>
            <div>
              <b>Email: </b>
              <span className='text-[16px]'>{general.email}</span>
            </div>
            <div>
              <b>Địa chỉ: </b>
              <span className='text-[16px]'>{general.address}</span>
            </div>
            <div>
              <b>Bản quyền: </b>
              <span className='text-[16px]'>{general.copyright}</span>
            </div>
            <Link
              to={'/admin/settings/general/edit'}
              className='nav-link border rounded-[5px] bg-[#525FE1] text-white px-[7px] py-[5px] w-[13%] text-center text-[14px]'
            >
              Chỉnh sửa
            </Link>
          </div>
        ) : (
          <>
            <div className='flex flex-col gap-[15px] mt-[20px] w-[50%] bg-[#FFFFFF] py-[15px] pl-[50px] shadow-md text-[17px]'>
              <Skeleton variant="text" width={170} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={250} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <div className='flex flex-col gap-[10px]'>
                <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="rectangular" width={150} height={150} sx={{ bgcolor: 'grey.400' }}/>
              </div>
              <Skeleton variant="text" width={220} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={220} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={220} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={400} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={94} height={33} sx={{ bgcolor: 'grey.400' }}/>
            </div>
          </>
        )
      )}
    </>
  )
}

export default General