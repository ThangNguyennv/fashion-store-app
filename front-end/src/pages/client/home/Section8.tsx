import { Link } from 'react-router-dom'
import BoxHead from '~/components/client/boxHead/BoxHead'
import BrandSlider from '~/components/client/brandSlider/BrandSlider'
import { useHome } from '~/contexts/client/HomeContext'

const Section8 = () => {
  const { dataHome } = useHome()
  const isLoading = !dataHome || !dataHome.articlesFeatured

  return (
    <>
      {/* Section 6 */}
      <div className="border-t border-[#0000001A]">
        <div className="container mx-auto px-[16px]">
          <div className="sm:px-[64px] px-[24px] sm:rounded-[40px] rounded-[20px]">
            <BoxHead title={'Bài viết nổi bật'}/>
            <BrandSlider items={dataHome.articlesFeatured || []} loading={isLoading} />
            <div className="text-center border-[#0000001A] sm:pt-[40px] pt-[30px] sm:pb-[62px] pb-[26px]">
              <Link
                className="nav-link border-[1px] text-[16px] font-[500] px-[63px] py-[16px] rounded-[62px] text-black inline-block sm:w-auto w-[100%] hover:bg-amber-300"
                to="/articles/articlesFeatured">
                Xem Tất Cả
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* End Section 6 */}
    </>
  )
}

export default Section8