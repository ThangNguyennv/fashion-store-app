import { MdOutlineLocalShipping } from 'react-icons/md'
import vnpayLogo from '~/assets/images/Payment/vnpay-logo.png'
import zalopayLogo from '~/assets/images/Payment/zalopay-logo.png'
import momoLogo from '~/assets/images/Payment/momo-logo.png'
import useCheckout from '~/hooks/client/checkout/useCheckout'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

const Checkout = () => {
  const {
    register,
    handleSubmit,
    errors,
    paymentMethod,
    setPaymentMethod,
    cartDetail,
    isSubmitting
  } = useCheckout()

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: 1000 }} open={isSubmitting}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className='bg-gray-50 py-12 mb-[100px]'>
        <div className='container mx-auto px-4'>
          <h1 className='text-3xl font-bold mb-8'>Thanh toán</h1>
          <form onSubmit={handleSubmit} className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

            {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG VÀ THANH TOÁN */}
            <div className='lg:col-span-2 bg-white p-6 rounded-lg shadow-md flex flex-col gap-6'>
              <div>
                <h2 className='text-xl font-semibold mb-4'>Thông tin giao hàng</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

                  <div className='flex flex-col gap-1'>
                    <label className="font-medium">Họ và tên</label>
                    <input
                      {...register('fullName')}
                      type="text"
                      className={`border p-2 rounded outline-none focus:ring-1 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.fullName && <span className="text-red-500 text-xs">{errors.fullName.message}</span>}
                  </div>

                  <div className='flex flex-col gap-1'>
                    <label className="font-medium">Số điện thoại</label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className={`border p-2 rounded outline-none focus:ring-1 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
                  </div>

                  {/* Địa chỉ */}
                  <div className='flex flex-col gap-1 sm:col-span-2'>
                    <label className="font-medium">Địa chỉ</label>
                    <input
                      {...register('address')}
                      type="text"
                      className={`border p-2 rounded outline-none focus:ring-1 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.address && <span className="text-red-500 text-xs">{errors.address.message}</span>}
                  </div>

                  {/* Ghi chú */}
                  <div className='flex flex-col gap-1 sm:col-span-2'>
                    <label className="font-medium">Ghi chú (tùy chọn)</label>
                    <textarea
                      {...register('note')}
                      rows={3}
                      className="border border-gray-300 p-2 rounded outline-none"
                    ></textarea>
                  </div>

                </div>
              </div>

              <div>
                <h2 className='text-xl font-semibold mb-4'>Phương thức thanh toán</h2>
                <div className="flex flex-col gap-3">
                  <label className={`flex items-center gap-4 cursor-pointer border p-4 rounded-lg transition-all ${paymentMethod === 'COD' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`}>
                    <input
                      type="radio"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <MdOutlineLocalShipping size={28} />
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </label>

                  <label className={`flex items-center gap-4 cursor-pointer border p-4 rounded-lg transition-all ${paymentMethod === 'VNPAY' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`}>
                    <input
                      type="radio"
                      value="VNPAY"
                      checked={paymentMethod === 'VNPAY'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <img src={vnpayLogo} alt="vnpay" className='h-[30px]'/>
                    <span>VNPay</span>
                  </label>

                  <label className={`flex items-center gap-4 cursor-pointer border p-4 rounded-lg transition-all ${paymentMethod === 'ZALOPAY' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`}>
                    <input
                      type="radio"
                      value="ZALOPAY"
                      checked={paymentMethod === 'ZALOPAY'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <img src={zalopayLogo} alt="zalopay" className='h-[30px]'/>
                    <span>ZaloPay</span>
                  </label>

                  <label className={`flex items-center gap-4 cursor-pointer border p-4 rounded-lg transition-all ${paymentMethod === 'MOMO' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`}>
                    <input
                      type="radio"
                      value="MOMO"
                      checked={paymentMethod === 'MOMO'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <img src={momoLogo} alt="momo" className='h-[30px]'/>
                    <span>MoMo</span>
                  </label>
                </div>
                {errors.paymentMethod && (
                  <span className="text-red-500 text-sm mt-2">{errors.paymentMethod.message}</span>
                )}
              </div>
            </div>

            {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
            <div className='lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit flex flex-col gap-4'>
              <h2 className='text-xl font-semibold border-b pb-3'>Đơn hàng của bạn</h2>
              {cartDetail?.products.map((item) => (
                <div key={`${item.product_id}-${item.color}-${item.size}`} className="flex items-center gap-4">
                  <div className="relative">
                    <img src={item.product_id?.thumbnail} className="w-16 h-16 object-cover rounded"/>
                    <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.product_id?.title}</p>
                    <p className="text-xs text-gray-500">{item.color}, {item.size}</p>
                  </div>
                  <span className="font-semibold text-sm">{item.totalPrice?.toLocaleString('vi-VN')}đ</span>
                </div>
              ))}
              <div className="border-t pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span>{Math.floor(cartDetail?.totalsPrice || 0).toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  {Math.floor(cartDetail?.totalsPrice || 0) > 500000 ? (
                    <span>Miễn phí</span>
                  ) : (
                    <span>15.000đ</span>
                  )}
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>(Miễn phí vận chuyển cho đơn hàng lớn hơn 500.000đ)</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Tổng cộng:</span>
                  {Math.floor(cartDetail?.totalsPrice || 0) > 500000 ? (
                    <span className="text-red-600">{Math.floor(cartDetail?.totalsPrice || 0).toLocaleString('vi-VN')}đ</span>
                  ) : (
                    <span className="text-red-600">{(Math.floor(cartDetail?.totalsPrice || 0) - 15000).toLocaleString('vi-VN')}đ</span>
                  )}
                </div>
              </div>
              <button
                type='submit'
                className='w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors mt-4 disabled:opacity-50'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Checkout