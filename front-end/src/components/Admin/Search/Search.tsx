import { IoSearchOutline } from 'react-icons/io5'

/* eslint-disable no-unused-vars */
interface Props {
    keyword: string,
    handleChangeKeyword: (value: string) => void
    handleSearch: (keyword: string) => void
}

const Search = ({ keyword, handleChangeKeyword, handleSearch }: Props) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    handleSearch(keyword)
  }

  return (
    <>
      <div className='w-[25%]'>
        <form
          onSubmit={handleSubmit}
          className='flex items-center gap-[2px] w-full border rounded-[15px] hover:shadow-md px-[10px]'
        >
          <button
            type="submit"
          >
            <IoSearchOutline />
          </button>
          <input
            onChange={(event) => handleChangeKeyword(event.target.value)}
            type="text"
            name="keyword"
            value={keyword}
            placeholder='Tìm kiếm theo số điện thoại...'
            className='outline-none p-[10px] w-full pr-10'
          />
        </form>
      </div>
    </>
  )
}

export default Search