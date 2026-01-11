import { IoEye, IoEyeOff } from 'react-icons/io5'
import Skeleton from '@mui/material/Skeleton'
import useChangePassword from '~/hooks/client/myAccount/useChangePassword'

const ChangePassword = () => {
  const {
    showCurrentPassword,
    setShowCurrentPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    register,
    errors,
    handleFormSubmit,
    myAccount,
    isSubmitting
  } = useChangePassword()

  return (
    <>
      {myAccount ? (
        <form
          onSubmit={handleFormSubmit}
          // Thay đổi: w-full trên mobile, giới hạn max-w-2xl trên desktop, mx-auto để căn giữa
          className='w-full max-w-2xl mx-auto flex flex-col items-center justify-center border rounded-[15px] p-4 md:p-8 bg-white shadow-sm'
          encType="multipart/form-data"
        >
          {/* Thay đổi: w-full thay vì w-[40%] để input không bị bóp nghẹt */}
          <div className='flex flex-col w-full gap-[20px]'>
            <h1 className='text-[20px] md:text-[25px] font-[600] text-center text-gray-800'>
              Thay đổi mật khẩu tài khoản
            </h1>

            <div className='flex flex-col gap-[15px]'>
              {/* Current Password */}
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Mật khẩu hiện tại"
                    className={`border rounded-[8px] p-[10px] w-full pr-10 outline-none transition-all focus:ring-2 focus:ring-blue-400 focus:border-transparent ${errors.currentPassword ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`}
                    {...register('currentPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                  >
                    {showCurrentPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                  </button>
                </div>
                {errors.currentPassword && <span className="text-red-500 text-sm ml-1">{errors.currentPassword.message}</span>}
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mật khẩu mới"
                    className={`border rounded-[8px] p-[10px] w-full pr-10 outline-none transition-all focus:ring-2 focus:ring-blue-400 focus:border-transparent ${errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                  >
                    {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                  </button>
                </div>
                {errors.password && <span className="text-red-500 text-sm ml-1">{errors.password.message}</span>}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Xác nhận lại mật khẩu"
                    className={`border rounded-[8px] p-[10px] w-full pr-10 outline-none transition-all focus:ring-2 focus:ring-blue-400 focus:border-transparent ${errors.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                  >
                    {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="text-red-500 text-sm ml-1">{errors.confirmPassword.message}</span>}
              </div>

              {/* Submit Button */}
              <div className='flex items-center justify-center mt-4'>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  // Thay đổi: w-full trên mobile, md:w-[40%] trên desktop
                  className={`cursor-pointer border rounded-[8px] py-[10px] px-4 text-white text-center w-full md:w-[40%] font-medium transition-colors ${isSubmitting ? 'bg-gray-400' : 'bg-[#525FE1] hover:bg-[#3f4bc0]'}`}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Cập nhật'}
                </button>
              </div>

            </div>
          </div>
        </form>
      ) : (
        // Skeleton Loading State - Responsive
        <div className='w-full max-w-2xl mx-auto flex items-center justify-center border rounded-[15px] p-4 md:p-8'>
          <div className='flex flex-col w-full gap-[20px]'>
            {/* Title Skeleton */}
            <div className="flex justify-center">
              <Skeleton variant="text" width="60%" height={40} sx={{ bgcolor: 'grey.300' }}/>
            </div>

            <div className='flex flex-col gap-[15px]'>
              {/* Input Skeletons: Dùng width 100% để tự fill */}
              <Skeleton variant="rectangular" width="100%" height={46} sx={{ bgcolor: 'grey.300', borderRadius: 1 }}/>
              <Skeleton variant="rectangular" width="100%" height={46} sx={{ bgcolor: 'grey.300', borderRadius: 1 }}/>
              <Skeleton variant="rectangular" width="100%" height={46} sx={{ bgcolor: 'grey.300', borderRadius: 1 }}/>

              {/* Button Skeleton */}
              <div className='flex items-center justify-center mt-2'>
                <Skeleton variant="rectangular" width={120} height={42} sx={{ bgcolor: 'grey.300', borderRadius: 1 }}/>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChangePassword