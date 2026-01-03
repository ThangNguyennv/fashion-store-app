import { Link } from 'react-router-dom'
import Skeleton from '@mui/material/Skeleton'
import { FaCheckCircle } from 'react-icons/fa'
import useSuccess from '~/hooks/client/checkout/useSuccess'

const Success = () => {
  const {
    order,
    loading
  } = useSuccess()


  if (loading) {
    return (
      <div className='container mx-auto p-8'>
        <Skeleton variant="text" width="60%" height={50} />
        <Skeleton variant="text" width="40%" height={30} sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" width="100%" height={300} />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Không tìm thấy đơn hàng</h1>
        <p className="text-gray-500 mt-2">Vui lòng kiểm tra lại mã đơn hàng hoặc liên hệ bộ phận hỗ trợ.</p>
        <Link to="/" className="mt-6 inline-block bg-black text-white px-6 py-2 rounded-lg">Quay về trang chủ</Link>
      </div>
    )
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='container mx-auto px-4'>
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto mb-[100px]">

          <div className="text-center border-b pb-6 mb-6">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Đặt hàng thành công!</h1>
            <p className="text-gray-500 mt-2">Cảm ơn bạn đã mua sắm. Dưới đây là chi tiết đơn hàng của bạn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Thông tin giao hàng</h2>
              <p><strong>Họ tên:</strong> {order.userInfo.fullName}</p>
              <p><strong>Điện thoại:</strong> {order.userInfo.phone}</p>
              <p><strong>Địa chỉ:</strong> {order.userInfo.address}</p>
            </div>
            <div className="text-left md:text-right">
              <h2 className="text-lg font-semibold mb-2">Thông tin đơn hàng</h2>
              <p><strong>Mã đơn hàng:</strong> #{order._id}</p>
              <p><strong>Ngày đặt:</strong> {new Date(order.createdAt!).toLocaleDateString('vi-VN')}</p>
              <p><strong>Thanh toán:</strong> {order.paymentInfo.method}</p>
              <p><strong>Trạng thái:</strong>
                <span className={
                  `font-semibold ml-1 ${order.paymentInfo.status === 'PAID' ?
                    'text-green-600' : order.paymentInfo.status === 'PENDING' ?
                      'text-yellow-600' : 'text-red-600'}`
                }>
                  {order.paymentInfo.status === 'PAID' ?
                    'Đã thanh toán' : order.paymentInfo.status === 'PENDING' ?
                      'Chờ thanh toán' : 'Thất bại'
                  }
                </span>
                {order.paymentInfo.status === 'FAILED' && (
                  <div>
                    <Link
                      to={'/checkout'}
                      className='border rounded-[5px] bg-emerald-600 p-[4px] text-amber-50 font-[500]'
                    >
                      Thanh toán lại
                    </Link>
                  </div>
                )}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Sản phẩm đã đặt</h2>
            <div className="border rounded-lg overflow-hidden">
              {order.products.map((product) => (
                <Link to={`/products/detail/${''}`} key={product.product_id} className="flex items-center gap-4 p-4 border-b last:border-b-0">
                  <img src={product.thumbnail} className="w-20 h-20 object-cover rounded"/>
                  <div className="flex-1">
                    <p className="font-semibold">{product.title}</p>
                    <p className="text-sm text-gray-500">Phân loại: {product.color}, {product.size}</p>
                    <p className="text-sm text-gray-500">Số lượng: {product.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {Math.floor((product.price * (100 - product.discountPercentage) / 100) * product.quantity).toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 border-t pt-6">
            <div className="flex justify-between w-full max-w-sm">
              <span className="text-gray-600">Tổng tạm tính:</span>
              <span className="font-semibold">{order.amount.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between w-full max-w-sm">
              <span className="text-gray-600">Phí vận chuyển:</span>
              <span className="font-semibold">Miễn phí</span>
            </div>
            <div className="flex justify-between w-full max-w-sm font-bold text-xl mt-2">
              <span>Tổng cộng:</span>
              <span className="text-red-600">{order.amount.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/user/my-orders" className="bg-black text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              Quản lý đơn hàng
            </Link>
            <Link to="/" className="ml-4 text-gray-600 font-semibold hover:underline">
              Tiếp tục mua sắm
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Success