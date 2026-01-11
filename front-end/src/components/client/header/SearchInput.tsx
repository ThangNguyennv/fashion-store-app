import { memo, type FormEvent } from 'react'
import { IoSearch } from 'react-icons/io5'
import type { SearchInputProps } from '~/hooks/client/searchInput/useSearchInput'
import clsx from 'clsx'


const SearchInput = ({ onSearchSubmit, onTermChange, inputValue, isMobile = false }: SearchInputProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearchSubmit()
  }
  const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTermChange(event.target.value)
  }
  // Tạo class động
  const formClassName = clsx(
    'flex items-center gap-x-[12px] px-[16px] py-[10px] bg-[#F0F0F0] rounded-[62px] text-[16px]',
    isMobile
      ? 'w-full' // Trên mobile: luôn hiển thị và rộng 100%
      : 'flex-1 lg:flex hidden' // Trên desktop: ẩn cho đến lg
  )

  return (
    <form
      onSubmit={handleSubmit}
      className={formClassName} // 4. Sử dụng class động
    >
      <button type="submit" className="text-[#00000066]">
        <IoSearch />
      </button>
      <input
        onChange={handleChangeKeyword}
        className="bg-transparent flex-1 outline-none" // Thêm outline-none
        type="text"
        name="keyword"
        value={inputValue}
        placeholder="Tìm kiếm sản phẩm..."
        autoComplete="off"
      />
    </form>
  )
}

export default memo(SearchInput)

