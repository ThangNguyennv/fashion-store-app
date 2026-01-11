/* eslint-disable no-unused-vars */
import { TableRow, TableCell, Checkbox } from '@mui/material'
import { Link } from 'react-router-dom'
import FormatDateTime from '../moment/FormatDateTime'
import type { ProductCategoryActions, ProductCategoryInfoInterface } from '~/types/productCategory.type'
import type { PaginationInterface } from '~/types/helper.type'

interface Props {
  index: number // Vị trí trong cùng cấp
  pagination: PaginationInterface | null
  parentNumber?: string // STT của cha, ví dụ: "2" hoặc "2.1"
  productCategory: ProductCategoryInfoInterface
  level: number
  selectedIds: string[]
  handleCheckbox: (_id: string, checked: boolean) => void
  handleToggleStatus: (_id: string, status: string) => void
  dispatchProductCategory: React.Dispatch<ProductCategoryActions>
  productCategories: ProductCategoryInfoInterface[]
  open: boolean
  handleOpen: (_id: string) => void
  handleClose: () => void
  handleDelete: () => void
}

const ProductTree = ({
  index,
  pagination,
  parentNumber,
  productCategory,
  level,
  selectedIds,
  handleCheckbox,
  handleToggleStatus,
  dispatchProductCategory,
  productCategories,
  open,
  handleOpen,
  handleClose,
  handleDelete
}: Props) => {
  const prefix = '— '.repeat(level)
  const lastUpdaterName = productCategory.lastUpdatedBy // Người cập nhật gần nhất
  const creatorName = productCategory.createdBy // Người tạo
  const baseIndex = pagination ? (pagination.currentPage - 1) * pagination.limitItems : 0
  const displayIndex = baseIndex + index + 1
  // Tạo số thứ tự phân cấp
  const currentNumber = parentNumber ? `${parentNumber}.${displayIndex}` : `${displayIndex}`

  return (
    <>
      <TableRow>
        <TableCell align="center" sx={{ padding: '0px 2px' }}>
          <Checkbox
            checked={selectedIds.includes(productCategory._id ?? '')}
            onChange={(e) => handleCheckbox(productCategory._id ?? '', e.target.checked)}
            size="small"
            sx={{ padding: 0 }}
          />
        </TableCell>
        <TableCell align="center" sx={{ padding: '0px 2px' }}>
          {currentNumber}
        </TableCell>
        <TableCell align="center" sx={{ padding: '10px 0px' }}>
          <div className="flex justify-center items-center">
            <img
              src={productCategory.thumbnail}
              alt={productCategory.title}
              className="w-[70px] h-[70px]"
            />
          </div>
        </TableCell>
        <TableCell align="left">
          <div className='font-[600] text-[14px]'>
            {prefix}{productCategory.title}
          </div>
        </TableCell>
        <TableCell align="center" sx={{ padding: '6px 0px' }}>
          <button
            onClick={() => handleToggleStatus(productCategory.status, productCategory._id ?? '')}
            className={`cursor-pointer border rounded-[5px] p-[5px] text-white 
              ${productCategory.status === 'ACTIVE' ? 'bg-[#18BA2A]' : 'bg-[#BC3433]'}`}
          >
            {productCategory.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động'}
          </button>
        </TableCell>
        <TableCell align="center" sx={{ padding: '6px 0px' }}>
          {creatorName ? (
            <>
              <p className="text-sm font-medium text-gray-800">{creatorName.fullName}</p>
              <FormatDateTime time={productCategory.createdAt} />
            </>
          ) : (
            <p className="text-sm italic text-gray-400">Không xác định</p>
          )}
        </TableCell>
        <TableCell align="center" sx={{ padding: '6px 0px' }}>
          {lastUpdaterName ? (
            <>
              <p className="text-sm font-medium text-gray-800">{lastUpdaterName.fullName}</p>
              <FormatDateTime time={lastUpdaterName.updatedAt} />
            </>
          ) : (
            <p className="text-sm italic text-gray-400">Chưa có ai cập nhật</p>
          )
          }
        </TableCell>
        <TableCell align="center" sx={{ padding: '6px 0px' }}>
          <Link
            to={`/admin/products-category/detail/${productCategory._id}`}
            className="nav-link border rounded-[5px] bg-[#0542AB] p-[5px] text-white"
          >
            Chi tiết
          </Link>
          <Link
            to={`/admin/products-category/edit/${productCategory._id}`}
            className="nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white"
          >
            Sửa
          </Link>
          <button
            onClick={() => handleOpen(productCategory._id ?? '')}
            className="border rounded-[5px] bg-[#BC3433] p-[5px] text-white"
          >
            Xóa
          </button>
        </TableCell>
      </TableRow>
      {productCategory.children?.map((child, idx) => (
        <ProductTree
          key={idx}
          index={idx}
          pagination={pagination}
          parentNumber={currentNumber}
          productCategory={child}
          level={level + 1}
          selectedIds={selectedIds}
          handleCheckbox={handleCheckbox}
          handleToggleStatus={handleToggleStatus}
          handleDelete={handleDelete}
          productCategories={productCategories}
          dispatchProductCategory={dispatchProductCategory}
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
        />
      ))}
    </>
  )
}

export default ProductTree