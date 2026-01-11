const Section7 = () => {
  return (
    <>
      {/* Section 7 */}
      <div className="relative">
        <div className="container mx-auto px-[16px]">
          <div className="flex flex-wrap items-center justify-between bg-primary rounded-[20px] md:px-[64px] px-[24px] md:py-[38px] py-[32px]">
            <h2 className="text-[#FFFFFF] xl:text-[40px] text-[32px] font-[700] xl:w-[551px] lg:w-[450px] w-[100%] lg:mb-[0] mb-[20px]">
              CẬP NHẬT VỀ ƯU ĐÃI MỚI NHẤT CỦA CHÚNG TÔI
            </h2>
            <form className="flex flex-col sm:gap-[14px] gap-[12px] lg:w-[349px] w-[100%]">
              <div className="flex gap-[12px] text-center items-center px-[16px] py-[12px] bg-[#FFFFFF] rounded-[62px] sm:text-[16px] text-[14px] font-[400]">
                <i className="fa-regular fa-envelope text-[20px] text-[#00000066]"></i>
                <input className="flex-1" type="email" placeholder="Nhập email của bạn..."/>
              </div>
              <button className="text-center py-[12px] bg-[#FFFFFF] rounded-[62px] sm:text-[16px] text-[14px] font-[500]">Đăng Ký Nhận Tin</button>
            </form>
          </div>
        </div>
      </div>
      {/* End Section 7 */}
    </>
  )
}

export default Section7