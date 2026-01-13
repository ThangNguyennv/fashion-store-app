/* eslint-disable no-unused-vars */
import { PiGreaterThan } from 'react-icons/pi'
import { PiLessThan } from 'react-icons/pi'
import type { PaginationInterface } from '~/interfaces/helper.interface'

interface Props {
  pagination: PaginationInterface | null
  items: unknown[],
  handlePagination: (page: number) => void
  handlePaginationPrevious: (page: number) => void
  handlePaginationNext: (page: number) => void
}

const Pagination = ({ pagination, handlePagination, handlePaginationPrevious, handlePaginationNext, items }: Props) => {
  const getPages = () => {
    if (pagination) {
      const pages: (number | string)[] = []

      // luôn có trang đầu
      pages.push(1)

      // hiển thị "..." nếu currentPage > 4
      if (pagination.currentPage > 3) {
        pages.push('...')
      }

      // tính các trang xung quanh currentPage (tối đa 4 trang)
      const start = Math.max(2, pagination.currentPage - 1)
      const end = Math.min(pagination.totalPage - 1, pagination.currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // hiển thị "..." nếu còn xa trang cuối
      if (pagination.currentPage < pagination.totalPage - 2) {
        pages.push('...')
      }

      // luôn có trang cuối (nếu > 1)
      if (pagination.totalPage > 1) {
        pages.push(pagination.totalPage)
      }
      return pages
    } else {
      return []
    }
  }
  const startIndex = pagination ? (pagination.currentPage - 1) * pagination.limitItems : 0
  const endIndex = pagination ? Math.min(pagination.currentPage * pagination.limitItems, pagination.totalItems) : 0

  return (
    <>
      {items && items.length > 0 && pagination && (
        <nav className='flex items-center justify-between p-[10px]'>
          <div>
            Hiển thị {startIndex + 1} - {endIndex} trong tổng số {pagination.totalItems}
          </div>
          <ul className='flex items-center justify-center gap-[10px]'>
            <li>
              <button
                disabled={pagination.currentPage === 1} // disable nút khi đang ở trang đầu
                onClick={() => handlePaginationPrevious(pagination.currentPage)}
              >
                <PiLessThan />
              </button>
            </li>
            {getPages().map((page, index) =>
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => handlePagination(page)}
                  className={`px-3 py-1 border rounded ${
                    page === pagination.currentPage ? 'bg-blue-500 text-white' : ''}`
                  }
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="px-2">
                  {page}
                </span>
              )
            )}
            <li>
              <button
                disabled={pagination.currentPage === pagination.totalPage} // disable nút khi đang ở trang cuối
                onClick={() => handlePaginationNext(pagination.currentPage)}
              >
                <PiGreaterThan />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  )
}

export default Pagination