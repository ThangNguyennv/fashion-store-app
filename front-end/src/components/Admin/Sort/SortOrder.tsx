/* eslint-disable no-unused-vars */
import type { ChangeEvent } from 'react'

interface SortProps {
  handleSort: (event: ChangeEvent<HTMLSelectElement>) => void,
  sortKey: string,
  sortValue: string,
  clearSortParams: () => void
}
const SortOrder = ({ handleSort, sortKey, sortValue, clearSortParams }:SortProps ) => {

  return (
    <>
      <div className='flex gap-[10px] items-center'>
        <select
          onChange={handleSort}
          className='cursor-pointer border rounded-[5px] border-[#9D9995] p-[5px] outline-none'
          value={sortKey && sortValue ? `${sortKey}-${sortValue}` : ''}
        >
          <option disabled value={''}>-- Sắp xếp --</option>
          <option value="amount-asc">Giá tăng dần</option>
          <option value="amount-desc">Giá giảm dần</option>
          <option value="createdAt-asc">Ngày tạo xa nhất</option>
          <option value="createdAt-desc">Ngày tạo gần nhất</option>
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

export default SortOrder