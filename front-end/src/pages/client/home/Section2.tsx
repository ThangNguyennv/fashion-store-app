import partner1 from '~/assets/images/Home/partner-1.svg'
import partner2 from '~/assets/images/Home/partner-2.svg'
import partner3 from '~/assets/images/Home/partner-3.svg'
import partner4 from '~/assets/images/Home/partner-4.svg'
import partner5 from '~/assets/images/Home/partner-5.svg'
import { Element } from 'react-scroll'

const Section2 = () => {
  return (
    <>
      {/* Section 2 */}
      <Element name={'section3'} className="bg-primary sm:py-[44px] py-[40px]">
        <div className="container mx-auto px-[16px]">
          <div className="flex flex-wrap justify-center sm:gap-x-[60px] gap-x-[34px] gap-y-[28px] viewerSection2">
            <img className="sm:h-[32px] h-[22px] w-auto" src={ partner1 } alt="Partner 1"/>
            <img className="sm:h-[32px] h-[22px] w-auto" src={ partner2 } alt="Partner 2"/>
            <img className="sm:h-[32px] h-[22px] w-auto" src={ partner3 } alt="Partner 3"/>
            <img className="sm:h-[32px] h-[22px] w-auto" src={ partner4 } alt="Partner 4"/>
            <img className="sm:h-[32px] h-[22px] w-auto" src={ partner5 } alt="Partner 5"/>
          </div>
        </div>
      </Element>
      {/* End Section 2 */}
    </>
  )
}

export default Section2