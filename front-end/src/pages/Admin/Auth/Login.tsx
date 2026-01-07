import { useLoginAdmin } from '~/hooks/Admin/Auth/useLogin'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { FaCircleUser } from 'react-icons/fa6'
import logo from '~/assets/images/Header/logo.jpg'
import { Link } from 'react-router-dom'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

const Login = () => {
  const {
    handleSubmit,
    showPassword,
    setShowPassword,
    register,
    errors,
    isSubmitting,
    onSubmit
  } = useLoginAdmin()

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSubmitting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="w-screen h-screen bg-[#252733] p-[25px] text-[#ECECEC] flex items-center justify-center">
        <div className='login-admin relative flex flex-col items-center justify-center gap-[10px] border rounded-[15px] border-[#231F40] p-[25px] bg-[#00171F] w-[450px] h-[550px] shadow-[0_0_20px_5px_rgba(0,255,255,0.3)]'>
          <FaCircleUser className='absolute top-[-80px] w-[150px] h-[150px]'/>
          <div className='flex flex-col w-full'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-[30px] text-center"
            >
              <div className='flex items-center justify-center gap-[10px] mb-[20px]'>
                <img src={logo} className='w-[50px] h-[50px]'/>
                <span className='text-[20px] font-[600] uppercase'>LUXUES STORE</span>
              </div>
              <div className='flex flex-col gap-[5px]'>
                <input
                  {...register('email')}
                  type="email"
                  className="border rounded-[5px] p-[10px] w-full pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white"
                  placeholder='Email'
                />
                <div className='flex items-center justify-start'>{errors.email && <span className="text-red-500 text-xs ml-1">{errors.email.message}</span>}</div>
              </div>
              <div className='flex flex-col gap-[5px]'>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="border rounded-[5px] p-[10px] w-full pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white"
                    placeholder='Mật khẩu'
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                  </button>
                </div>
                <div className='flex items-center justify-start'>
                  {errors.password && <span className="text-red-500 text-xs ml-1">{errors.password.message}</span>}
                </div>
              </div>
              <div className='flex items-center justify-start'>
                <Link
                  to="/admin/auth/forgot-password"
                  className='text-[14px] text-blue-400 hover:underline'
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <button
                type='submit'
                className="py-[8px] border rounded-[5px] bg-[#525FE1] text-[#F5F5F5] border-[#525FE1] disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login

