import { FaTwitter } from 'react-icons/fa'
import { FaFacebook } from 'react-icons/fa'
import { FaInstagram } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa'
import visa from '~/assets/images/Footer/Visa.svg'
import applePay from '~/assets/images/Footer/ApplePay.svg'
import gPay from '~/assets/images/Footer/GPay.svg'
import masterCard from '~/assets/images/Footer/Mastercard.svg'
import paypal from '~/assets/images/Footer/Paypal.svg'
import { useSettingGeneral } from '~/contexts/client/SettingGeneralContext'

function Footer() {
  const { settingGeneral } = useSettingGeneral()
  return (
    <>
      <footer className="bg-[#F0F0F0] pt-[148px] lg:pb-[84px] pb-[30px] mt-[-98px]">
        <div className="container mx-auto px-[16px]">
          <div className="flex flex-wrap justify-between pb-[48px] border-b border-[#0000001A]">
            <div className="flex flex-col lg:gap-[25px] gap-[15px] lg:w-[248px] w-[100%] lg:mb-[0] mb-[40px]">
              <h3 className="sm:text-[34px] text-[28px] text-primary font-[700]">LUXUES STORE</h3>
              <p className="text-[14px] font-[400] text-[#00000099]">
                Chúng tôi có những bộ quần áo phù hợp với phong cách của bạn và bạn có thể tự hào khi mặc.
              </p>
              <div className="flex flex-wrap gap-[12px]">
                <a
                  className="
                    w-[28px] h-[28px]
                    bg-white hover:bg-black border
                    border-[#00000033] hover:border-black rounded-[50%]
                    text-[12px] hover:text-white text-black
                    inline-flex items-center justify-center"
                  href="#"
                  target="_blank"
                >
                  <FaTwitter />
                </a>
                <a
                  className="
                    w-[28px] h-[28px]
                    bg-white hover:bg-black
                    border border-[#00000033] hover:border-black rounded-[50%]
                    text-[12px] hover:text-white text-black
                    inline-flex items-center justify-center"
                  href="#"
                  target="_blank"
                >
                  <FaFacebook />
                </a>
                <a
                  className="
                    w-[28px] h-[28px]
                    bg-white hover:bg-black
                    border border-[#00000033] hover:border-black rounded-[50%]
                    text-[12px] hover:text-white text-black
                    inline-flex items-center justify-center"
                  href="#"
                  target="_blank"
                >
                  <FaInstagram />
                </a>
                <a
                  className="
                    w-[28px] h-[28px]
                    bg-white hover:bg-black
                    border border-[#00000033] hover:border-black rounded-[50%]
                    text-[12px] hover:text-white text-black
                    inline-flex items-center justify-center"
                  href="#"
                  target="_blank"
                >
                  <FaGithub />
                </a>
              </div>
            </div>
            <div className="sm:w-auto w-[48%]">
              <h2 className="text-black font-[500] uppercase mb-[26px] text-[16px]">CÔNG TY</h2>
              <ul className="flex flex-col gap-[16px]">
                <li>
                  <a className="text-[16px] hover:text-[black] text-[#00000099] font-[400]" href="#">Giới Thiệu</a>
                </li>
                <li>
                  <a className="text-[16px] hover:text-[black] text-[#00000099] font-[400]" href="#">Sản Phẩm</a>
                </li>
                <li>
                  <a className="text-[16px] hover:text-[black] text-[#00000099] font-[400]" href="#">Công Việc</a>
                </li>
                <li>
                  <a className="text-[16px] hover:text-[black] text-[#00000099] font-[400]" href="#">Việc Làm</a>
                </li>
              </ul>
            </div>
            <div className="sm:w-auto w-[48%]">
              <h2 className="text-black font-[500] uppercase mb-[26px]">Trợ giúp</h2>
              <ul className="flex flex-col gap-[16px]">
                <li>
                  <a className="text-[16px] hover:text-[black] text-[#00000099] font-[400]" href="#">Hỗ Trợ Khách Hàng</a>
                </li>
                <li>
                  <a className="text-[16px] hover:text-[black] text-[#00000099] font-[400]" href="#">Thông Tin Đơn Hàng</a>
                </li>
                <li>
                  <a className="text-[16px] hover:text-[black] text-[#00000099] font-[400]" href="#">Điều Khoản & Điều Kiện</a>
                </li>
                <li>
                  <a className="text-[16px] hover:text-[black] text-[#00000099] font-[400]" href="#">Chính Sách</a>
                </li>
              </ul>
            </div>
            <div className="sm:w-auto w-[48%] sm:mt-[0] mt-[32px]">
              <h2 className="text-black font-[500] uppercase mb-[26px]">FAQ</h2>
              <ul className="flex flex-col gap-[16px]">
                <li>
                  <a className="text-[16px] hover:text-[black] text-[#00000099] font-[400]" href="#">Tài Khoản</a>
                </li>
                <li>
                  <a className="text-[16px] hover:text-[black] text-[#00000099] font-[400]" href="#">Quản Lý Đơn Hàng</a>
                </li>
                <li>
                  <a className="text-[16px] hover:text-[black] text-[#00000099] font-[400]" href="#">Đơn Hàng</a>
                </li>
                <li>
                  <a className="text-[16px] hover:text-[black] text-[#00000099] font-[400]" href="#">Thanh Toán</a>
                </li>
              </ul>
            </div>
            <div className="sm:w-auto w-[48%] sm:mt-[0] mt-[32px]">
              <h2 className="text-black font-[500] uppercase mb-[26px]">Tài nguyên</h2>
              <ul className="flex flex-col gap-[16px]">
                <li>
                  <a className="text-[16px] hover:text-[black] text-[#00000099] font-[400]" href="#">Sách Miễn Phí</a>
                </li>
                <li>
                  <a className="text-[16px] hover:text-[black] text-[#00000099] font-[400]" href="#">Bài Viết</a>
                </li>
                <li>
                  <a className="text-[16px] hover:text-[black] text-[#00000099] font-[400]" href="#">Kiến Thức</a>
                </li>
                <li>
                  <a className="text-[16px] hover:text-[black] text-[#00000099] font-[400]" href="#">Youtube</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap justify-between mt-[30px]">
            <div className="md:w-auto w-[100%] text-[14px] font-[400] text-[#00000099] flex items-center justify-center md:mb-[0] mb-[20px]">
              {settingGeneral ? settingGeneral[0].copyright : ''}
            </div>
            <div className="md:w-auto w-[100%] flex justify-center items-center gap-[12px]">
              <img className="bg-[#FFFFFF] p-[8px] w-[47px] rounded-[5.38px] object-contain" src={ visa }/>
              <img className="bg-[#FFFFFF] p-[8px] w-[47px] rounded-[5.38px] object-contain" src={ masterCard }/>
              <img className="bg-[#FFFFFF] p-[8px] w-[47px] rounded-[5.38px] object-contain" src={ paypal }/>
              <img className="bg-[#FFFFFF] p-[8px] w-[47px] rounded-[5.38px] object-contain" src={ applePay }/>
              <img className="bg-[#FFFFFF] p-[8px] w-[47px] rounded-[5.38px] object-contain" src={ gPay }/>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer