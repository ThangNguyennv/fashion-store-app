
import { useEditMyAccount } from '~/hooks/admin/myAccount/useEdit'
import Skeleton from '@mui/material/Skeleton'

const EditMyAccount = () => {
  const {
    isLoading,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleImageChange,
    onSubmit,
    navigate,
    preview
  } = useEditMyAccount()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-[15px] w-[50%] text-[17px] bg-[#FFFFFF] py-[15px] px-[50px] shadow-md mt-[15px]">
        <Skeleton variant="text" width={350} height={35} sx={{ bgcolor: 'grey.400' }}/>
        <div className="flex flex-col gap-[10px]">
          <Skeleton variant="text" width={48} height={20} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={90} height={35} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="circular" width={150} height={150} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <div className="form-group">
          <Skeleton variant="text" width={48} height={20} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={668} height={32} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <div className="form-group">
          <Skeleton variant="text" width={48} height={20} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={668} height={32} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <div className="form-group">
          <Skeleton variant="text" width={48} height={20} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={668} height={32} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <div className="form-group">
          <Skeleton variant="text" width={48} height={20} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={668} height={32} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <Skeleton variant="rectangular" width={113} height={40} sx={{ bgcolor: 'grey.400' }}/>
      </div>
    )
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md mt-[15px]"
      >
        <h1 className="text-[24px] font-[600] text-[#192335]">Chỉnh sửa tài khoản của tôi</h1>

        {/* Avatar */}
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

        {/* Full name */}
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

        {/* Email */}
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

        {/* Phone */}
        <div className="form-group flex flex-col gap-2">
          <label className="text-[#192335]">Số điện thoại <span className="text-red-500">*</span></label>
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

        {/* Password */}
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

        {/* Submit buttons */}
        <div className="flex gap-3 mt-4 text-[14px]">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#525FE1] hover:bg-[#4248B8] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-[5px] px-[12px] transition-colors"
          >
            {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/my-account')}
            disabled={isSubmitting}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-[5px] px-6 py-[10px] transition-colors"
          >
            Hủy
          </button>
        </div>
      </form>

    </>
  )
}

export default EditMyAccount