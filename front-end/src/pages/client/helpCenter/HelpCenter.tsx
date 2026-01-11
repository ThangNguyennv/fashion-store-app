import { Link } from 'react-router-dom'
import { FaQuestionCircle, FaShippingFast, FaUndo, FaEnvelope } from 'react-icons/fa'

const HelpCenter = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 my-12 mb-[100px]">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Trung tâm Hỗ trợ
      </h1>
      <p className="text-center text-lg text-gray-600 mb-12">
        Chúng tôi có thể giúp gì cho bạn?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Thẻ FAQ */}
        <Link to="/faq" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <FaQuestionCircle className="text-4xl text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Câu hỏi thường gặp (FAQ)</h2>
          <p className="text-gray-600">Tìm câu trả lời cho các câu hỏi phổ biến nhất.</p>
        </Link>

        {/* Thẻ Chính sách Giao hàng */}
        <Link to="/shipping-policy" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <FaShippingFast className="text-4xl text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Chính sách Giao hàng</h2>
          <p className="text-gray-600">Thông tin về vận chuyển và thời gian giao hàng.</p>
        </Link>

        {/* Thẻ Chính sách Đổi trả */}
        <Link to="/return-policy" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <FaUndo className="text-4xl text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Đổi/Trả hàng & Hoàn tiền</h2>
          <p className="text-gray-600">Cách thức đổi trả sản phẩm nếu bạn không hài lòng.</p>
        </Link>

        {/* Thẻ Liên hệ */}
        <Link to={''} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <FaEnvelope className="text-4xl text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Liên hệ với chúng tôi</h2>
          <p className="text-gray-600">Không tìm thấy câu trả lời? Gửi email cho chúng tôi tại:</p>
          <p className="text-blue-600 font-semibold">
            support@luxues.com
          </p>
        </Link>
      </div>
    </div>
  )
}

export default HelpCenter