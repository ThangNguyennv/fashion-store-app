import { IoEye, IoEyeOff } from 'react-icons/io5'
import useReset from '~/hooks/client/auth/password/useReset'
import { Backdrop, CircularProgress } from '@mui/material'

const Reset = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword
  } = useReset()

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSubmitting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-[70px] p-8 md:p-[70px] mt-[40px] mb-[80px] bg-[#96D5FE]">
        <div className='flex flex-col gap-[10px] text-center text-[20px] mb-8 md:mb-0'>
          <div className='font-[600]'>LUXUES STORE</div>
          <div>Shop thời trang được yêu thích nhất tại Việt Nam</div>
        </div>

        <div className="w-full max-w-md md:w-[40%] lg:w-[30%]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-[15px] text-center border rounded-[5px] p-[20px] bg-amber-50"
          >
            <div className='text-[20px] font-[500]'>Đổi mật khẩu</div>

            {/* Ô nhập mật khẩu mới */}
            <div className="flex flex-col gap-1 text-left">
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu mới"
                  className={`border rounded-[5px] p-[10px] w-full pr-10 focus:ring-2 focus:ring-blue-400 outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>
              {errors.password && <span className="text-red-500 text-xs ml-1">{errors.password.message}</span>}
            </div>

            {/* Ô nhập xác nhận lại mật khẩu */}
            <div className="flex flex-col gap-1 text-left">
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Xác nhận lại mật khẩu"
                  className={`border rounded-[5px] p-[10px] w-full pr-10 focus:ring-2 focus:ring-blue-400 outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="text-red-500 text-xs ml-1">{errors.confirmPassword.message}</span>}
            </div>

            <button
              type='submit'
              className='w-full bg-[#192335] border rounded-[5px] p-[10px] text-white cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Reset