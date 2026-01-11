import { useInView } from 'react-intersection-observer'
import backgroundHome from '~/assets/images/Home/background-home.png'
import star from '~/assets/images/Home/star.svg'
import CountUp from 'react-countup'
import { Link } from 'react-scroll'

const Section1 = () => {
  const { ref, inView } = useInView({ triggerOnce: true }) // chỉ chạy 1 lần khi vào view
  return (
    <>
      {/* Section 1 */}
      <div className="bg-[#F2F0F1] truncate">
        <div className="container mx-auto px-[16px] whitespace-normal">
          <div className="flex flex-wrap items-center" data-aos="fade-up" data-aos-duration="2000">
            <div className="lg:w-[48.6%] w-[100%] lg:mt-[0] mt-[40px]">
              <h1 className="font-[900] xl:text-[48px] sm:text-[32px] text-[28px] text-primary mb-[10px]" data-aos="fade-up" data-aos-duration="2000" data-aos-delay="300">
                CHUYÊN THỜI TRANG PHONG CÁCH, HIỆN ĐẠI
              </h1>
              <p className="font-[400] xl:text-[16px] text-[14px] text-[#00000099] xl:mb-[50px] mb-[30px]" data-aos="fade-up" data-aos-duration="2000" data-aos-delay="200">
                Chúng tôi chuyên cung cấp nhiều loại quần áo được chế tác tỉ mỉ, được thiết kế để làm nổi bật cá tính của bạn và đáp ứng phong cách của bạn.
              </p>
              <Link
                className="sm:inline-block block text-center bg-primary rounded-[62px] py-[16px] px-[64px] font-[500] text-[16px] text-white"
                data-aos="fade-up"
                data-aos-duration="2000"
                data-aos-delay="150"
                to={'section3'}
                smooth={true}
                duration={500}
              >
                Xem Ngay
              </Link>
              <div className="flex flex-wrap xl:mt-[50px] mt-[30px] sm:justify-start justify-center sm:text-left text-center sm:gap-[0] gap-x-[75px] gap-y-[10px]">
                <div ref={ref} className="sm:pr-[32px] sm:border-r border-[#0000001A] sm:mr-[32px]">
                  <div className="text-primary xl:text-[40px] text-[24px] font-[700]">
                    {inView && <CountUp start={0} end={200} duration={2} />}+
                  </div>
                  <div className="font-[400] xl:text-[16px] text-[12px] text-[#00000099]">
                    Thương Hiệu
                  </div>
                </div>
                <div className="sm:pr-[32px] sm:border-r border-[#0000001A] sm:mr-[32px]">
                  <div className="text-primary xl:text-[40px] text-[24px] font-[700]">
                    {inView && <CountUp start={0} end={2000} duration={2} />}+
                  </div>
                  <div className="font-[400] xl:text-[16px] text-[12px] text-[#00000099]">Sản Phẩm Chất Lượng</div>
                </div>
                <div className="sm:pr-[32px] sm:border-r border-[#0000001A] sm:mr-[32px]">
                  <div className="text-primary xl:text-[40px] text-[24px] font-[700]">
                    {inView && <CountUp start={0} end={30000} duration={2} />}+
                  </div>
                  <div className="font-[400] xl:text-[16px] text-[12px] text-[#00000099]">Khách Hàng</div>
                </div>
              </div>
            </div>
            <div className="relative xl:ml-[60px] lg:flex-1 flex-none w-[100%]" data-aos="fade-up" data-aos-duration="2000" data-aos-delay="150">
              <img className="w-[100%]" src={ backgroundHome } alt="bg-section1"/>
              <img className="w-[56px] absolute left-[0] top-[48%] sm:block hidden" src={ star }/>
              <img className="w-[104px] absolute right-[0] top-[14%] sm:block hidden" src={ star }/>
            </div>
          </div>
        </div>
      </div>
      {/* End Section 1 */}
    </>
  )
}

export default Section1