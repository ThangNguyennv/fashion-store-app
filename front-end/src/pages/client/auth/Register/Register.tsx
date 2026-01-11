import { Link } from 'react-router-dom'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import useRegister from '~/hooks/client/auth/register/useRegister'

const RegisterClient = () => {
  const {
    handleSubmit,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    register,
    errors,
    onSubmit,
    isSubmitting
  } = useRegister()

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
            <div className='text-[20px] font-[500]'>Đăng ký</div>

            {/* Full Name */}
            <div className="text-left">
              <input
                {...register('fullName')}
                type='text'
                placeholder="Họ và tên"
                className="border rounded-[5px] p-[10px] w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="text-left">
              <input
                {...register('email')}
                type='email'
                placeholder="Email"
                className="border rounded-[5px] p-[10px] w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="text-left">
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu"
                  className="border rounded-[5px] p-[10px] w-full pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="text-left">
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Xác nhận lại mật khẩu"
                  className="border rounded-[5px] p-[10px] w-full pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Password Requirements Hint */}
            <div className="text-left text-xs text-gray-600 bg-blue-50 p-3 rounded">
              <p className="font-semibold mb-1">Mật khẩu phải có:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ít nhất 8 ký tự</li>
                <li>Ít nhất 1 chữ hoa (A-Z)</li>
                <li>Ít nhất 1 chữ thường (a-z)</li>
                <li>Ít nhất 1 số (0-9)</li>
                <li>Ít nhất 1 ký tự đặc biệt (@$!%*?&)</li>
              </ul>
            </div>

            <button
              type='submit'
              className='w-full bg-[#192335] hover:bg-[#2a3547] transition-colors border rounded-[5px] p-[10px] text-white cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-[5px] text-sm sm:text-[15px]">
              <p>Bạn đã có tài khoản?</p>
              <Link
                to={'/user/login'}
                className='text-[#525FE1] font-[600] hover:underline'
              >
                Đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default RegisterClient