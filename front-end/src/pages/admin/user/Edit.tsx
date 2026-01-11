import { Link } from 'react-router-dom'
import Skeleton from '@mui/material/Skeleton'
import useEdit from '~/hooks/admin/user/useEdit'


const EditUser = () => {
  const {
    role,
    isLoading,
    register,
    handleSubmit,
    errors,
    watchedStatus,
    handleImageChange,
    onSubmit,
    preview,
    isSubmitting
  } = useEdit()

  return (
    <>
      {role && role.permissions.includes('users_edit') && (
        !isLoading ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md mt-[15px]"
            encType="multipart/form-data"
          >
            <h1 className="text-[24px] font-[600] text-[#192335]">Chỉnh sửa tài khoản người dùng</h1>
            <div className="flex flex-col gap-[10px]">
              <label className="text-[#192335]">Avatar</label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="avatar-upload"
                onChange={handleImageChange}
              />
              <label
                htmlFor="avatar-upload"
                className="bg-[#9D9995] hover:bg-[#87857F] transition-colors border rounded-[5px] w-[100px] inline-block px-4 py-2 text-[14px] cursor-pointer text-center text-white"
              >
          Chọn ảnh
              </label>
              {preview ? (
                <img
                  src={preview}
                  alt="Avatar preview"
                  className="w-[150px] h-[150px] rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <Skeleton variant="circular" width={150} height={150} />
              )}
            </div>

            <div className="form-group flex flex-col gap-2">
              <label className="text-[#192335]">
          Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                {...register('fullName')}
                className="py-[8px] px-[12px] border border-gray-300 rounded-[5px] focus:outline-none focus:border-[#525FE1] transition-colors"
              />
              {errors.fullName && (
                <p className="text-red-500 text-[14px]">{errors.fullName.message}</p>
              )}
            </div>

            <div className="form-group flex flex-col gap-2">
              <label className="text-[#192335]">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register('email')}
                type="email"
                className="py-[8px] px-[12px] border border-gray-300 rounded-[5px] focus:outline-none focus:border-[#525FE1] transition-colors"
              />
              {errors.email && (
                <p className="text-red-500 text-[14px]">{errors.email.message}</p>
              )}
            </div>


            <div className="form-group flex flex-col gap-2">
              <label className="text-[#192335]">Số điện thoại</label>
              <input
                {...register('phone')}
                type="tel"
                placeholder="VD: 0912345678"
                className="py-[8px] px-[12px] border border-gray-300 rounded-[5px] focus:outline-none focus:border-[#525FE1] transition-colors"
              />
              {errors.phone && (
                <p className="text-red-500 text-[14px]">{errors.phone.message}</p>
              )}
            </div>


            <div className="form-group">
              <label htmlFor="address">Địa chỉ</label>
              <input
                {...register('address')}
                type="text"
                id="address"
                name="address"
                className='py-[3px] text-[16px]'
              />
              {errors.address && (
                <p className="text-red-500 text-[14px]">{errors.address.message}</p>
              )}
            </div>

            <div className="form-group flex flex-col gap-2">
              <label className="text-[#192335]">Mật khẩu mới</label>
              <input
                {...register('password')}
                type="password"
                placeholder="Để trống nếu không muốn đổi mật khẩu"
                className="py-[8px] px-[12px] border border-gray-300 rounded-[5px] focus:outline-none focus:border-[#525FE1] transition-colors"
              />
              {errors.password && (
                <p className="text-red-500 text-[14px]">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#192335]">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-[15px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register('status')}
                    type="radio"
                    value="ACTIVE"
                    checked={watchedStatus === 'ACTIVE'}
                    className="cursor-pointer"
                  />
                  <span>Hoạt động</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register('status')}
                    type="radio"
                    value="INACTIVE"
                    checked={watchedStatus === 'INACTIVE'}
                    className="cursor-pointer"
                  />
                  <span>Dừng hoạt động</span>
                </label>
              </div>
            </div>
            <div className='flex items-center justify-start text-center gap-[5px]'>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-[8%] border rounded-[5px] bg-[#525FE1] text-white p-[7px] text-[14px] disabled:opacity-50"
              >
                {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
              <Link
                to="/admin/users"
                className="w-[6%] border rounded-[5px] bg-[#525FE1] text-white p-[7px] text-[14px]"
              >
                Hủy
              </Link>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md">
            <Skeleton variant="text" width={470} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <div className="flex flex-col gap-[5px]">
              <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="circular" width={150} height={150} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={75} height={31} sx={{ bgcolor: 'grey.400' }}/>
            </div>

            <div className="form-group">
              <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>

            <div className="form-group">
              <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>

            <div className="form-group">
              <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>

            <div className="form-group">
              <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>

            <div className='flex items-center justify-start gap-[15px]'>
              <Skeleton variant="text" width={120} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={120} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <Skeleton variant="rectangular" width={76} height={37} sx={{ bgcolor: 'grey.400' }}/>
          </div>
        )
      )}
    </>
  )
}

export default EditUser