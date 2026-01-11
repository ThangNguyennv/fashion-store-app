import useForgot from '~/hooks/client/auth/password/useForgot'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

const Forgot = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit
  } = useForgot()

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: 1000 }} open={isSubmitting}>
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
            <div className='text-[20px] font-[500]'>Lấy lại mật khẩu</div>
            <div className="flex flex-col gap-1 text-left">
              <input
                {...register('email')}
                type='text'
                placeholder="Nhập email của bạn"
                className={`border rounded p-[10px] outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && (
                <span className="text-red-500 text-xs">{errors.email.message}</span>
              )}
            </div>
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-[#192335] text-white p-[10px] rounded disabled:opacity-50'
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi email xác nhận'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Forgot