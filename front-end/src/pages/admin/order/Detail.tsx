import Skeleton from '@mui/material/Skeleton'
import { useDetail } from '~/hooks/admin/order/useDetail'
import { formatDateForInput } from '~/helpers/formatDateForInput'
import { Link } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'

const DetailOrder = () => {
  const {
    orderDetail,
    role,
    handleSubmitConfirmedDay,
    handleSubmitDeliveryDay
  } = useDetail()

  return (
    <>
      {role && role.permissions.includes('orders_view') && (
        orderDetail ? (
          <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[25px] shadow-md mt-[15px] text-[17px]'>
            <div className='text-[24px] font-[600] text-[#00171F]'>
              Chi tiết đơn hàng
            </div>
            <div className='flex gap-[20px]'>
              <div className='flex flex-col gap-[15px]'>
                <div className='flex flex-col gap-[15px]'>
                  {orderDetail.products.length > 0 && (
                    orderDetail.products.map((product, index) => (
                      <div className='flex items-center justify-between border rounded-[5px] p-[10px]' key={index}>
                        <div className='flex flex-col gap-[10px]'>
                          <div>
                            <b>Tên sản phẩm: </b>
                            {product.title}
                          </div>
                          <div>
                            <b>Giá: </b>
                            {product.price.toLocaleString('vi-VN')}đ
                          </div>
                          <div>
                            <b>Giảm giá: </b>
                            {product.discountPercentage}%
                          </div>
                          <div>
                            <b>Số lượng: </b>
                            {product.quantity}
                          </div>
                          {orderDetail.note && (
                            <div>
                              <b>Lời nhắn: </b>
                              {orderDetail.note}
                            </div>
                          )}
                        </div>
                        <div>
                          <img src={product.thumbnail} className='w-[150px] h-[150px]'/>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div>
                  <b>Trạng thái: </b>
                  {
                    orderDetail.status === 'PENDING' ?
                      <span className="text-[#FFAB19] font-[600]">Đang xử lý</span> :
                      orderDetail.status === 'TRANSPORTING' ?
                        <span className="text-[#2F57EF] font-[600]">Đang vận chuyển</span> :
                        orderDetail.status === 'CONFIRMED' ?
                          <span className="text-green-500 font-[600]">Đã hoàn thành</span> :
                          <span className="text-[#BC3433] font-[600]">Đã hủy</span>
                  }
                </div>
                <div>
                  {orderDetail.status == 'TRANSPORTING' && (
                    <form onSubmit={(e) => handleSubmitDeliveryDay(e)} className='flex flex-col gap-[10px]'>
                      <div className='flex items-center gap-[5px]'>
                        <b>Thời gian giao hàng: </b>
                        <input
                          type='date'
                          name='estimatedDeliveryDay'
                          className='border rounded-[5px] p-[2px]'
                          defaultValue={formatDateForInput(orderDetail.estimatedDeliveryDay)}
                        />
                      </div>
                      <button type='submit' className='border rounded-[5px] p-[4px] bg-amber-500 text-amber-50 w-[12%] text-[16px]'>
                        Cập nhật
                      </button>
                    </form>
                  )}
                  {orderDetail.status == 'CONFIRMED' && (
                    <form onSubmit={(e) => handleSubmitConfirmedDay(e)} className='flex flex-col gap-[10px]'>
                      <div className='flex items-center gap-[5px]'>
                        <b>Thời gian nhận hàng: </b>
                        <input
                          type='date'
                          name='estimatedConfirmedDay'
                          className='border rounded-[5px] p-[2px]'
                          defaultValue={formatDateForInput(orderDetail.estimatedConfirmedDay)}
                        />
                      </div>
                      <button type='submit' className='border rounded-[5px] p-[4px] bg-amber-500 text-amber-50 w-[12%] text-[16px]'>
                        Cập nhật
                      </button>
                    </form>
                  )}
                </div>
              </div>
              <div className='flex flex-col gap-[15px]'>
                <div className='font-[600] text-[20px]'>Thông tin người đặt hàng</div>
                <div className='flex flex-col gap-[10px]'>
                  <div>
                    <b>Họ và tên: </b>
                    {orderDetail.userInfo.fullName}
                  </div>
                  <div>
                    <b>Số điện thoại: </b>
                    {orderDetail.userInfo.phone}
                  </div>
                  <div>
                    <b>Địa chỉ: </b>
                    {orderDetail.userInfo.address}
                  </div>
                </div>
              </div>
            </div>
            <button className='flex items-center justify-start'>
              <Link to={'/admin/orders/'} className='flex items-center justify-between gap-[5px] text-black border rounded-[5px] p-[5px]'>
                <IoArrowBack />
                Quay lại
              </Link>
            </button>
          </div>
        ) : (
          <>
            <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[25px] shadow-md mt-[15px] text-[17px]'>
              <Skeleton variant="text" width={120} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <div className='flex gap-[20px]'>
                <div className='flex flex-col gap-[15px]'>
                  <div className='flex flex-col gap-[15px]'>
                    <div className='flex flex-col gap-[10px] border rounded-[5px] p-[10px]'>
                      <Skeleton variant="text" width={403} height={26} sx={{ bgcolor: 'grey.400' }}/>
                      <Skeleton variant="text" width={100} height={32} sx={{ bgcolor: 'grey.400' }}/>
                      <Skeleton variant="text" width={90} height={32} sx={{ bgcolor: 'grey.400' }}/>
                      <Skeleton variant="text" width={70} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </div>
                  </div>
                  <Skeleton variant="text" width={200} height={32} sx={{ bgcolor: 'grey.400' }}/>
                </div>
                <div className='flex flex-col gap-[15px]'>
                  <Skeleton variant="text" width={385} height={48} sx={{ bgcolor: 'grey.400' }}/>
                  <div className='flex flex-col gap-[10px]'>
                    <Skeleton variant="text" width={220} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    <Skeleton variant="text" width={231} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    <Skeleton variant="text" width={210} height={32} sx={{ bgcolor: 'grey.400' }}/>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      )}
    </>
  )
}

export default DetailOrder