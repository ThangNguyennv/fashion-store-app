import useOTP from '~/hooks/client/auth/password/useOTP'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

const OTP = () => {
  const {
    handleSubmit,
    email,
    handleClick,
    isSending,
    isLoading
  } = useOTP()

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
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
            onSubmit={(event) => handleSubmit(event)}
            className="flex flex-col gap-[15px] text-center border rounded-[5px] p-[20px] bg-amber-50"
          >
            <div className='text-[20px] font-[500]'>Lấy lại mật khẩu</div>
            <input
              type='email'
              name='email'
              placeholder="Email"
              className="border rounded-[5px] p-[10px] bg-gray-200"
              value={email}
              readOnly
            />
            <input
              type='text'
              name='otp'
              placeholder="Nhập mã OTP"
              className="border rounded-[5px] p-[10px] focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              required
            />
            <div
              onClick={handleClick}
              className={
                `hover:underline text-[14px] font-[400] text-[#0A033C] cursor-pointer flex items-center justify-start 
                ${isSending ? 'opacity-50 pointer-events-none' : ''}`
              }
            >
              {isSending ? 'Đang gửi...' : 'Gửi lại mã OTP?'}
            </div>
            <button
              type='submit'
              className='w-full bg-[#192335] border rouned-[5px] p-[10px] text-white cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
              disabled={isLoading}
            >
              {isLoading ? 'Đang xác nhận...' : 'Xác nhận mã OTP'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default OTP