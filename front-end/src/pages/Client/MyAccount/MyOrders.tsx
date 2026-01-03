import { Link } from 'react-router-dom'
import { FaCircleCheck, FaRegStar, FaStar } from 'react-icons/fa6'
import { BsClockFill } from 'react-icons/bs'
import { MdLocalShipping } from 'react-icons/md'
import { MdOutlineCancel } from 'react-icons/md'
import FormatDateTime from '~/components/Admin/Moment/FormatDateTime'
import OrderProgress from '~/pages/Client/MyAccount/OrderProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Pagination from '~/components/Admin/Pagination/Pagination'
import { FaFilter } from 'react-icons/fa'
import { formatDateIntl } from '~/helpers/formatDateIntl'
import useMyOrder from '~/hooks/client/myAccount/useMyOrder'
import { MYORDER_STATUSES } from '~/utils/constants'

const MyOrders = () => {
  const {
    pagination,
    handleReviewSubmit,
    handleRemoveReviewImage,
    handleReviewImageChange,
    handleOpenReview,
    handleSubmit,
    open,
    setTypeStatusOrder,
    openReview,
    updateParams,
    handleOpen,
    handleClose,
    handleCancel,
    handleBuyBack,
    typeStatusOrder,
    selectedDate,
    setSelectedDate,
    orders,
    statusToStep,
    handleCloseReview,
    productToReview,
    reviewContent,
    setReviewRating,
    reviewRating,
    setReviewContent,
    reviewPreviews
  } = useMyOrder()

  return (
    <div className="flex flex-col gap-[15px] flex-1">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[10px]">
          <h2 className="text-[22px] font-[600]">Đơn hàng của tôi</h2>
          <span className="text-[14px] text-[#555]">Theo dõi và quản lý lịch sử đơn hàng của bạn</span>
        </div>
        <form
          onSubmit={(event) => handleSubmit(event)}
          className="flex items-center justify-center gap-[10px]"
        >
          <div className="flex items-center justify-center gap-[5px] border rounded-[5px] p-[5px]">
            <FaFilter />
            <select
              name='type'
              value={typeStatusOrder}
              onChange={(e) => setTypeStatusOrder(e.target.value)}
              className='outline-none'
            >
              {MYORDER_STATUSES.map((status, idx) => (
                <option key={idx} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-center gap-[5px] border rounded-[5px] p-[4px]">
            <input
              type='date'
              name='selectedDate'
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <button type='submit' className='border rounded-[5px] p-[4px] bg-blue-500 text-amber-100'>Áp dụng</button>
        </form>
      </div>
      {orders && orders.length > 0 ? (
        orders.map((order, index) => (
          <div
            className="flex flex-col gap-[10px] border rounded-[5px] border-blue-100 shadow-xl p-[15px]"
            key={index}
          >
            <div className="flex items-center justify-between">
              <div className='flex items-center justify-center gap-[10px]'>
                <div className='flex flex-col gap-[5px]'>
                  <span className='font-[700] text-[17px]'>Mã đơn: {order._id}</span>
                  <div className='flex items-center gap-[5px]'>
                    <span>Đặt hàng vào:</span>
                    <b><FormatDateTime time={order.createdAt}/></b>
                  </div>
                </div>
                {
                  order.status == 'PENDING' ?
                    <div className="text-[#FFAB19] font-[600] border rounded-[10px] bg-amber-200 p-[4px] flex items-center justify-center gap-[4px] text-[14px]">
                      <BsClockFill />
                      <span>Đang xử lý</span>
                    </div> :
                    order.status == 'TRANSPORTING' ?
                      <div className="text-[#2F57EF] font-[600] border rounded-[10px] bg-blue-200 p-[4px] flex items-center justify-center gap-[4px] text-[14px]">
                        <MdLocalShipping />
                        <span>Đang vận chuyển</span>
                      </div> :
                      order.status == 'CONFIRMED' ?
                        <div className="text-green-500 font-[600] border rounded-[10px] bg-emerald-200 p-[4px] flex items-center justify-center gap-[4px] text-[14px]">
                          <FaCircleCheck />
                          <span>Đã hoàn thành</span>
                        </div> :
                        <div className="text-[#BC3433] font-[600] border rounded-[10px] bg-red-200 p-[4px] flex items-center justify-center gap-[4px] text-[14px]">
                          <MdOutlineCancel />
                          <span>Đã hủy</span>
                        </div>
                }
              </div>
              <Link
                to={`/checkout/success/${order._id}`}
                className='text-blue-600 hover:underline'
              >
                Xem chi tiết
              </Link>
            </div>
            <div className='flex flex-col gap-4 mt-4'>
              {order.products && order.products.length > 0 && (
                order.products.map((product, idx) => (
                  <div className='flex items-center justify-between gap-4 border-b pb-4' key={idx}>
                    <div className='flex items-center gap-3'>
                      <img src={product.thumbnail} className='w-20 h-20 object-contain rounded-md'/>
                      <div className='flex flex-col gap-1'>
                        <span className='font-semibold'>{product.title}</span>
                        <span className="text-sm text-gray-500">
                          Phân loại: {product.color}{product.size ? `, ${product.size}` : ''}
                        </span>
                        <span className="text-sm">
                          Số lượng: {product.quantity}
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center justify-between gap-[30px]'>
                      <div className="text-right">
                        <span className="font-semibold">
                          {Math.floor((product.price * (100 - product.discountPercentage)) / 100).toLocaleString()}đ
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        {order.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleOpenReview(product, order._id)}
                            className='text-white font-semibold border rounded-md bg-blue-500 px-3 py-1 text-sm'
                          >
                            Đánh giá
                          </button>
                        )}
                        {(order.status === 'CONFIRMED' || order.status === 'CANCELED') && (
                          <button
                            onClick={() => handleBuyBack(product.product_id, product.quantity, product.color, product.size)}
                            className='text-black font-semibold border rounded-md bg-gray-200 px-3 py-1 text-sm'
                          >
                            Mua lại
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )))}
            </div>
            <div className='flex flex-col gap-[10px]'>
              <div>
                {order.status == 'TRANSPORTING' && (
                  <div className='flex items-center gap-[5px]'>
                    <span>Ngày giao hàng dự kiến:</span>
                    <span className='font-[600]'>
                      {formatDateIntl(order.estimatedDeliveryDay)}
                    </span>
                  </div>
                )}
                {order.status == 'CONFIRMED' && (
                  <div className='flex items-center gap-[5px]'>
                    <span>Ngày nhận hàng:</span>
                    <span className='font-[600]'>
                      {formatDateIntl(order.estimatedConfirmedDay)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                {order.status !== 'CANCELED' && (
                  <OrderProgress currentStep={statusToStep[order.status] ?? 0} />
                )}
              </div>
            </div>
            <div className='flex items-center justify-end gap-3 mt-4'>
              <div className='font-semibold text-lg'>
                <span>Tổng tiền: </span>
                <span className='text-red-600'>{order.amount.toLocaleString()}đ</span>
              </div>
              {order.status == 'PENDING' && (
                <button
                  onClick={() => handleOpen(order._id)}
                  className='text-white font-semibold border rounded-md bg-red-500 px-4 py-2'
                >
                  Hủy đơn hàng
                </button>
              )}
              {order.status == 'CONFIRMED' && (
                <button className='text-black font-semibold border rounded-md bg-gray-200 px-4 py-2'>
                  Yêu cầu trả hàng
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className='text-red'>Không tồn tại đơn hàng nào!</div>
      )}
      <Pagination
        pagination={pagination}
        handlePagination={(page: number) => updateParams({ page: page })}
        handlePaginationPrevious={(page: number) => updateParams({ page: page - 1 })}
        handlePaginationNext={(page: number) => updateParams({ page: page + 1 })}
        items={orders}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Xác nhận hủy</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn hủy đơn hàng này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button
            onClick={handleCancel}
            color="error"
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      {/* === THÊM POPUP ĐÁNH GIÁ VÀO CUỐI COMPONENT === */}
      <Dialog open={openReview} onClose={handleCloseReview} fullWidth maxWidth="sm">
        <DialogTitle>Đánh giá sản phẩm</DialogTitle>
        <DialogContent>
          {productToReview && (
            <div className="flex flex-col gap-4 py-4">
              {/* Card thông tin sản phẩm */}
              <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                <img src={productToReview.thumbnail} className="w-16 h-16 object-cover rounded"/>
                <div className='flex flex-col gap-[4px]'>
                  <span className="font-semibold">{productToReview.title}</span>
                  <span>{productToReview.color}, {productToReview.size}</span>
                </div>
              </div>

              {/* Chọn số sao */}
              <div className="flex items-center justify-center gap-2 text-3xl text-yellow-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} onClick={() => setReviewRating(index + 1)} className="cursor-pointer">
                    {index < reviewRating ? <FaStar /> : <FaRegStar />}
                  </span>
                ))}
              </div>

              {/* Mô tả */}
              <textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                rows={4}
                placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này nhé!"
                className="w-full p-2 border rounded-md"
              ></textarea>

              {/* Upload ảnh */}
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  id="review-images-upload"
                  className="hidden"
                  onChange={handleReviewImageChange}
                />
                <label htmlFor="review-images-upload" className="cursor-pointer bg-blue-100 text-blue-600 px-4 py-2 rounded-md">
                  + Thêm hình ảnh
                </label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {reviewPreviews.map((src, index) => (
                    <div key={index} className="relative group">
                      <img src={src} className="w-full h-20 object-cover rounded"/>
                      <button onClick={() => handleRemoveReviewImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100">
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReview}>Hủy</Button>
          <Button onClick={handleReviewSubmit} variant="contained">Gửi đánh giá</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default MyOrders