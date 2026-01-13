/* eslint-disable no-unused-vars */
import { TableRow, TableCell, Checkbox } from '@mui/material'
import FormatDateTime from '../moment/FormatDateTime'
import type { ProductCategoryActions, ProductCategoryInfoInterface } from '~/interfaces/productCategory.interface'
import type { AccountInfoInterface } from '~/interfaces/account.interface'

interface Props {
  productCategory: ProductCategoryInfoInterface
  level: number
  selectedIds: string[]
  accounts: AccountInfoInterface[]
  handleCheckbox: (_id: string, checked: boolean) => void
  dispatchProductCategory: React.Dispatch<ProductCategoryActions>
  productCategories: ProductCategoryInfoInterface[]
  openPermanentlyDelete: boolean
  handleOpenPermanentlyDelete: (_id: string) => void
  handleClosePermanentlyDelete: () => void
  handlePermanentlyDelete: () => void
  handleRecover: (_id: string) => void
}

const ProductCategoryTrashTree = ({
  productCategory,
  level,
  selectedIds,
  accounts,
  handleCheckbox,
  dispatchProductCategory,
  productCategories,
  openPermanentlyDelete,
  handleOpenPermanentlyDelete,
  handleClosePermanentlyDelete,
  handlePermanentlyDelete,
  handleRecover
}: Props) => {
  const prefix = '— '.repeat(level)

  const creator = accounts.find((account) => account._id === productCategory.createdBy.account_id)

  return (
    <>
      <TableRow key={productCategory._id}>
        <TableCell align="center" sx={{ padding: '0px 2px' }}>
          <Checkbox
            checked={selectedIds.includes(productCategory._id ?? '')}
            onChange={(e) => handleCheckbox(productCategory._id ?? '', e.target.checked)}
            size="small"
            sx={{ padding: 0 }}
          />
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
            className={`cursor-pointer border rounded-[5px] p-[5px] text-white 
              ${productCategory.status === 'ACTIVE' ? 'bg-[#18BA2A]' : 'bg-[#BC3433]'}`}
          >
            {productCategory.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động'}
          </button>
        </TableCell>
        <TableCell align="center" sx={{ padding: '6px 0px' }}>
          {creator ? (
            <>
              <p className="text-sm font-medium text-gray-800">{creator.fullName}</p>
              <FormatDateTime time={productCategory.createdAt} />
            </>
          ) : (
            <p className="text-sm italic text-gray-400">Không xác định</p>
          )}
        </TableCell>
        <TableCell align='center' sx={{ padding: '6px 0px' }} className='font-[700] '>{(() => {
          const creator = accounts?.find(
            (account) => account._id === productCategory.deletedBy?.account_id
          )
          return creator ? (
            <>
              <span className="text-sm font-medium text-gray-800">
                {creator.fullName}
              </span>
              <FormatDateTime time={productCategory.deletedBy.deletedAt}/>
            </>
          ) : (
            <span className="text-sm italic text-gray-400">Không xác định</span>
          )
        })()}
        </TableCell>
        <TableCell align="center" sx={{ padding: '6px 0px' }}>
          <button
            onClick={() => handleRecover(productCategory._id ?? '')}
            className='nav-link border rounded-[5px] bg-[#525FE1] p-[5px] text-white'
          >
            Khôi phục
          </button>
          <button
            onClick={() => handleOpenPermanentlyDelete(productCategory._id ?? '')}
            className="border rounded-[5px] bg-[#BC3433] p-[5px] text-white"
          >
            Xóa vĩnh viễn
          </button>
        </TableCell>
      </TableRow>
      {productCategory.children?.map((child) => (
        <ProductCategoryTrashTree
          key={child._id}
          productCategory={child}
          level={level + 1}
          selectedIds={selectedIds}
          accounts={accounts}
          handleCheckbox={handleCheckbox}
          handlePermanentlyDelete={handlePermanentlyDelete}
          productCategories={productCategories}
          dispatchProductCategory={dispatchProductCategory}
          openPermanentlyDelete={openPermanentlyDelete}
          handleOpenPermanentlyDelete={handleOpenPermanentlyDelete}
          handleClosePermanentlyDelete={handleClosePermanentlyDelete}
          handleRecover={handleRecover}
        />
      ))}
    </>
  )
}

export default ProductCategoryTrashTree