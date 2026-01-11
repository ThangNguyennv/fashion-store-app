interface Props {
    title: string
}

const BoxHead = ({ title }: Props) => {
  return (
    <div className="text-center font-[700] sm:text-[48px] text-[32px] text-primary sm:mt-[62px] mt-[40px] sm:mb-[39px] mb-[17px] uppercase">{title}</div>
  )
}

export default BoxHead