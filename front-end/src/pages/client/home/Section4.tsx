import { Link } from 'react-router-dom'
import BoxHead from '~/components/client/boxHead/BoxHead'
import SliderWrapper from '~/components/client/sliderWrapper/SliderWrapper'
import { useHome } from '~/contexts/client/HomeContext'

const Section4 = () => {
  const { dataHome } = useHome()
  const isLoading = !dataHome || !dataHome.productsFeatured

  return (
    <>
      {/* Section 4 */}
      <div className="border-t border-[#0000001A] sm:pb-[62px] pb-[40px]">
        <div className="container mx-auto px-[16px]">
          <BoxHead title={'Sản phẩm nổi bật'}/>
          <SliderWrapper items={dataHome.productsFeatured || []} loading={isLoading} />
          <div className="text-center sm:mt-[40px] mt-[30px]">
            <Link
              className="
                nav-link border border-[#0000001A]
                rounded-[62px] py-[16px] px-[63px]
                font-[500] sm:text-[16px] text-[14px]
                text-black inline-block sm:w-auto
                w-[100%] hover:bg-amber-300
              "
              to="/products/productsFeatured"
            >
              Xem Tất Cả
            </Link>
          </div>
        </div>
      </div>
      {/* End Section 4 */}
    </>
  )
}

export default Section4