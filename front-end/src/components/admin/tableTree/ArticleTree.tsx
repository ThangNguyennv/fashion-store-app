/* eslint-disable no-unused-vars */
import { TableRow, TableCell, Checkbox } from '@mui/material'
import { Link } from 'react-router-dom'
import FormatDateTime from '../moment/FormatDateTime'
import type { ArticleCategoryActions, ArticleCategoryInfoInterface } from '~/types/articleCategory.type'
import type { AccountInfoInterface } from '~/types/account.type'
import type { PaginationInterface } from '~/types/helper.type'

interface Props {
  articleCategory: ArticleCategoryInfoInterface
  index: number // Vị trí trong cùng cấp
  pagination: PaginationInterface | null
  parentNumber?: string // STT của cha, ví dụ: "2" hoặc "2.1"
  level: number
  selectedIds: string[]
  accounts: AccountInfoInterface[]
  handleCheckbox: (_id: string, checked: boolean) => void
  handleToggleStatus: (_id: string, status: string) => void
  dispatchArticleCategory: React.Dispatch<ArticleCategoryActions>
  articleCategories: ArticleCategoryInfoInterface[]
  open: boolean
  handleOpen: (_id: string) => void
  handleClose: () => void
  handleDelete: () => void
}

const ArticleTree = ({
  index,
  pagination,
  parentNumber,
  articleCategory,
  level,
  selectedIds,
  accounts,
  handleCheckbox,
  handleToggleStatus,
  dispatchArticleCategory,
  articleCategories,
  open,
  handleOpen,
  handleClose,
  handleDelete
}: Props) => {
  const prefix = '— '.repeat(level)

  // const updatedBy = articleCategory.updatedBy.at(-1)
  // const creator = accounts.find((account) => account._id === articleCategory.createdBy.account_id)
  // const updater = accounts.find((account) => account._id === updatedBy?.account_id)

  const lastUpdaterName = articleCategory.lastUpdatedBy // Người cập nhật gần nhất
  const creatorName = articleCategory.createdBy // Người tạo
  const baseIndex = pagination ? (pagination.currentPage - 1) * pagination.limitItems : 0
  const displayIndex = baseIndex + index + 1
  // Tạo số thứ tự phân cấp
  const currentNumber = parentNumber ? `${parentNumber}.${displayIndex}` : `${displayIndex}`

  return (
    <>
      <TableRow key={articleCategory._id}>
        <TableCell align="center" sx={{ padding: '0px 2px' }}>
          <Checkbox
            checked={selectedIds.includes(articleCategory._id ?? '')}
            onChange={(e) => handleCheckbox(articleCategory._id ?? '', e.target.checked)}
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
              src={articleCategory.thumbnail}
              alt={articleCategory.title}
              className="w-[70px] h-[70px]"
            />
          </div>
        </TableCell>
        <TableCell align="left">
          <div className='font-[600] text-[14px]'>
            {prefix}{articleCategory.title}
          </div>
        </TableCell>
        <TableCell align="center" sx={{ padding: '6px 0px' }}>
          <button
            onClick={() => handleToggleStatus(articleCategory.status, articleCategory._id ?? '')}
            className={`cursor-pointer border rounded-[5px] p-[5px] text-white 
              ${articleCategory.status === 'ACTIVE' ? 'bg-[#18BA2A]' : 'bg-[#BC3433]'}`}
          >
            {articleCategory.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động'}
          </button>
        </TableCell>
        <TableCell align="center" sx={{ padding: '6px 0px' }}>
          {creatorName ? (
            <>
              <p className="text-sm font-medium text-gray-800">{creatorName.fullName}</p>
              <FormatDateTime time={articleCategory.createdAt} />
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
          )}
        </TableCell>
        <TableCell align="center" sx={{ padding: '6px 0px' }}>
          <Link
            to={`/admin/articles-category/detail/${articleCategory._id}`}
            className="border rounded-[5px] bg-[#0542AB] p-[5px] text-white"
          >
            Chi tiết
          </Link>
          <Link
            to={`/admin/articles-category/edit/${articleCategory._id}`}
            className="border rounded-[5px] bg-[#FFAB19] p-[5px] text-white"
          >
            Sửa
          </Link>
          <button
            onClick={() => handleOpen(articleCategory._id ?? '')}
            className="cursor-pointer border rounded-[5px] bg-[#BC3433] p-[5px] text-white"
          >
            Xóa
          </button>
        </TableCell>
      </TableRow>
      {articleCategory.children?.map((child, idx) => (
        <ArticleTree
          key={idx}
          index={idx}
          pagination={pagination}
          parentNumber={currentNumber}
          articleCategory={child}
          level={level + 1}
          selectedIds={selectedIds}
          accounts={accounts}
          handleCheckbox={handleCheckbox}
          handleToggleStatus={handleToggleStatus}
          articleCategories={articleCategories}
          dispatchArticleCategory={dispatchArticleCategory}
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />
      ))}
    </>
  )
}

export default ArticleTree