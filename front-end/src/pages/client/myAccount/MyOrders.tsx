import { Link } from 'react-router-dom'
import { FaCircleCheck, FaRegStar, FaStar } from 'react-icons/fa6'
import { BsClockFill } from 'react-icons/bs'
import { MdLocalShipping, MdOutlineCancel } from 'react-icons/md'
import { FaFilter } from 'react-icons/fa'
import FormatDateTime from '~/components/admin/moment/FormatDateTime'
import OrderProgress from '~/pages/client/myAccount/OrderProgress'
import Pagination from '~/components/admin/pagination/Pagination'
import { formatDateIntl } from '~/helpers/formatDateIntl.helper'
import useMyOrder from '~/hooks/client/myAccount/useMyOrder'
import { MYORDER_STATUSES } from '~/utils/constants'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

const MyOrders = () => {
  const {
    pagination, handleReviewSubmit, handleRemoveReviewImage, handleReviewImageChange,
    handleOpenReview, handleSubmit, open, setTypeStatusOrder, openReview,
    updateParams, handleOpen, handleClose, handleCancel, handleBuyBack,
    typeStatusOrder, selectedDate, setSelectedDate, orders, statusToStep,
    handleCloseReview, productToReview, reviewContent, setReviewRating,
    reviewRating, setReviewContent, reviewPreviews
  } = useMyOrder()

  return (
    <div className="flex flex-col gap-[15px] flex-1 w-full">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-[5px]">
          <h2 className="text-[20px] md:text-[22px] font-[600]">Đơn hàng của tôi</h2>
          <span className="text-[13px] md:text-[14px] text-[#555]">Theo dõi và quản lý lịch sử đơn hàng của bạn</span>
        </div>

        <form
          onSubmit={(event) => handleSubmit(event)}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[10px] w-full lg:w-auto"
        >
          <div className="flex items-center gap-[5px] border rounded-[5px] p-[8px] sm:p-[5px] bg-white">
            <FaFilter className="text-gray-500" />
            <select
              name='type'
              value={typeStatusOrder}
              onChange={(e) => setTypeStatusOrder(e.target.value)}
              className='outline-none bg-transparent w-full sm:w-auto'
            >
              {MYORDER_STATUSES.map((status, idx) => (
                <option key={idx} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center gap-[5px] border rounded-[5px] p-[8px] sm:p-[4px] bg-white">
            <input
              type='date'
              name='selectedDate'
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className='outline-none bg-transparent w-full'
            />
          </div>

          <button
            type='submit'
            className='border rounded-[5px] py-[8px] px-4 bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors sm:w-auto'
          >
            Áp dụng
          </button>
        </form>
      </div>

      {orders && orders.length > 0 ? (
        orders.map((order, index) => (
          <div
            className="flex flex-col gap-[15px] border rounded-[8px] border-blue-50 shadow-sm hover:shadow-md transition-shadow p-[15px] bg-white"
            key={index}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-3 border-dashed">
              <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-[15px]'>
                <div className='flex flex-col gap-[2px]'>
                  <span className='font-[700] text-[16px] md:text-[17px]'>Mã đơn: <span className="text-blue-600">#{order._id.slice(-6).toUpperCase()}</span></span>
                  <div className='flex items-center gap-[5px] text-sm text-gray-500'>
                    <span>Đặt ngày:</span>
                    <b><FormatDateTime time={order.createdAt} /></b>
                  </div>
                </div>

                <div className="self-start sm:self-center">
                  {order.status == 'PENDING' ?
                    <div className="text-[#FFAB19] font-[600] border border-amber-200 rounded-full bg-amber-50 px-3 py-1 flex items-center gap-[4px] text-[13px]">
                      <BsClockFill /> <span>Đang xử lý</span>
                    </div> :
                    order.status == 'TRANSPORTING' ?
                      <div className="text-[#2F57EF] font-[600] border border-blue-200 rounded-full bg-blue-50 px-3 py-1 flex items-center gap-[4px] text-[13px]">
                        <MdLocalShipping /> <span>Đang vận chuyển</span>
                      </div> :
                      order.status == 'CONFIRMED' ?
                        <div className="text-green-600 font-[600] border border-green-200 rounded-full bg-green-50 px-3 py-1 flex items-center gap-[4px] text-[13px]">
                          <FaCircleCheck /> <span>Đã hoàn thành</span>
                        </div> :
                        <div className="text-[#BC3433] font-[600] border border-red-200 rounded-full bg-red-50 px-3 py-1 flex items-center gap-[4px] text-[13px]">
                          <MdOutlineCancel /> <span>Đã hủy</span>
                        </div>
                  }
                </div>
              </div>

              <Link
                to={`/checkout/success/${order._id}`}
                className='text-blue-600 hover:underline text-sm font-medium self-end md:self-auto'
              >
                Xem chi tiết &gt;
              </Link>
            </div>

            <div className='flex flex-col gap-4'>
              {order.products && order.products.length > 0 && (
                order.products.map((product, idx) => (
                  <div className='flex flex-col sm:flex-row items-start gap-4 border-b last:border-0 pb-4 last:pb-0' key={idx}>

                    <div className='flex items-start gap-3 w-full sm:w-auto flex-1'>
                      <img src={product.thumbnail} className='w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border bg-gray-50 flex-shrink-0' alt={product.title} />
                      <div className='flex flex-col gap-1'>
                        <span className='font-semibold text-[15px] line-clamp-2'>{product.title}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 w-fit px-2 py-0.5 rounded">
                          {product.color}{product.size ? `, Size: ${product.size}` : ''}
                        </span>
                        <span className="text-sm text-gray-600">x{product.quantity}</span>
                      </div>
                    </div>

                    <div className='flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0'>
                      <div className="font-semibold text-red-600 text-[16px]">
                        {Math.floor((product.price * (100 - product.discountPercentage)) / 100).toLocaleString()}đ
                      </div>

                      <div className="flex gap-2 mt-0 sm:mt-2">
                        {order.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleOpenReview(product, order._id)}
                            className='text-white text-xs sm:text-sm font-medium border rounded bg-blue-500 hover:bg-blue-600 px-3 py-1.5 transition-colors whitespace-nowrap'
                          >
                            Đánh giá
                          </button>
                        )}
                        {(order.status === 'CONFIRMED' || order.status === 'CANCELED') && (
                          <button
                            onClick={() => handleBuyBack(product.product_id, product.quantity, product.color, product.size)}
                            className='text-gray-700 text-xs sm:text-sm font-medium border rounded bg-gray-100 hover:bg-gray-200 px-3 py-1.5 transition-colors whitespace-nowrap'
                          >
                            Mua lại
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className='flex flex-col gap-[15px] bg-gray-50 p-3 rounded-md mt-2'>
              <div className="text-sm">
                {order.status == 'TRANSPORTING' && (
                  <div className='flex items-center justify-between'>
                    <span className="text-gray-600">Giao dự kiến:</span>
                    <span className='font-[600] text-blue-600'>{formatDateIntl(order.estimatedDeliveryDay)}</span>
                  </div>
                )}
                {order.status == 'CONFIRMED' && (
                  <div className='flex items-center justify-between'>
                    <span className="text-gray-600">Ngày nhận hàng:</span>
                    <span className='font-[600] text-green-600'>{formatDateIntl(order.estimatedConfirmedDay)}</span>
                  </div>
                )}
              </div>

              {order.status !== 'CANCELED' && (
                <div className="overflow-x-auto pb-2">
                  {/* Đảm bảo OrderProgress có min-width bên trong nếu cần */}
                  <div className="min-w-[300px]">
                    <OrderProgress currentStep={statusToStep[order.status] ?? 0} />
                  </div>
                </div>
              )}
            </div>

            <div className='flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 border-t pt-4'>
              <div className='flex items-center gap-2 text-lg'>
                <span className="text-gray-600 font-medium">Tổng tiền: </span>
                <span className='text-red-600 font-bold text-[18px] sm:text-[20px]'>
                  {order.amount.toLocaleString()}đ
                </span>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                {order.status == 'PENDING' && (
                  <button
                    onClick={() => handleOpen(order._id)}
                    className='flex-1 sm:flex-none text-white font-semibold border rounded-md bg-red-500 hover:bg-red-600 px-4 py-2 transition-colors'
                  >
                    Hủy đơn hàng
                  </button>
                )}
                {order.status == 'CONFIRMED' && (
                  <button className='flex-1 sm:flex-none text-gray-700 font-semibold border rounded-md bg-gray-100 hover:bg-gray-200 px-4 py-2 transition-colors'>
                    Yêu cầu trả hàng
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className='text-center py-10 text-gray-500'>Không tồn tại đơn hàng nào!</div>
      )}

      <Pagination
        pagination={pagination}
        handlePagination={(page) => updateParams({ page: page })}
        handlePaginationPrevious={(page) => updateParams({ page: page - 1 })}
        handlePaginationNext={(page) => updateParams({ page: page + 1 })}
        items={orders}
      />

      <Dialog open={open} onClose={handleClose} aria-labelledby="delete-dialog-title">
        <DialogTitle id="delete-dialog-title">Xác nhận hủy</DialogTitle>
        <DialogContent>
          <DialogContentText>Bạn có chắc chắn muốn hủy đơn hàng này không?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleCancel} color="error" variant="contained">Xác nhận</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openReview} onClose={handleCloseReview} fullWidth maxWidth="sm">
        <DialogTitle>Đánh giá sản phẩm</DialogTitle>
        <DialogContent dividers>
          {productToReview && (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border">
                <img src={productToReview.thumbnail} className="w-14 h-14 object-cover rounded bg-white" alt="Review Product"/>
                <div className='flex flex-col'>
                  <span className="font-semibold text-sm line-clamp-1">{productToReview.title}</span>
                  <span className="text-xs text-gray-500">{productToReview.color}, {productToReview.size}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Chất lượng sản phẩm</span>
                <div className="flex items-center gap-3 text-3xl text-yellow-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} onClick={() => setReviewRating(index + 1)} className="cursor-pointer hover:scale-110 transition-transform">
                      {index < reviewRating ? <FaStar /> : <FaRegStar />}
                    </span>
                  ))}
                </div>
              </div>

              <textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                rows={4}
                placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này nhé!"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              ></textarea>

              <div>
                <input
                  type="file" multiple accept="image/*"
                  id="review-images-upload" className="hidden"
                  onChange={handleReviewImageChange}
                />
                <label htmlFor="review-images-upload" className="inline-block cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200">
                  + Thêm hình ảnh
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                  {reviewPreviews.map((src, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img src={src} className="w-full h-full object-cover rounded border"/>
                      <button onClick={() => handleRemoveReviewImage(index)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm">
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
          <Button onClick={handleReviewSubmit} variant="contained" disabled={!reviewRating}>Gửi đánh giá</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default MyOrders