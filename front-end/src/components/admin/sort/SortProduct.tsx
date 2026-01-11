/* eslint-disable no-unused-vars */
import type { ChangeEvent } from 'react'

interface SortProps {
  handleSort: (event: ChangeEvent<HTMLSelectElement>) => void,
  sortKey: string,
  sortValue: string,
  clearSortParams: () => void
}
const SortProduct = ({ handleSort, sortKey, sortValue, clearSortParams }:SortProps ) => {

  return (
    <>
      <div className='flex gap-[10px] items-center'>
        <select
          onChange={handleSort}
          className='cursor-pointer border rounded-[5px] border-[#9D9995] p-[5px] outline-none'
          value={sortKey && sortValue ? `${sortKey}-${sortValue}` : ''}
        >
          <option disabled value={''}>-- Sắp xếp --</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
          <option value="title-asc">Tiêu đề A - Z</option>
          <option value="title-desc">Tiêu đề Z - A</option>
        </select>
        <button
          onClick={clearSortParams}
          className='border rounded-[5px] border-[#9D9995] p-[5px] bg-[#96D5FE]'
        >
          Clear
        </button>
      </div>
    </>
  )
}

export default SortProduct