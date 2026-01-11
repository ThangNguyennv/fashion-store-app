import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { Link } from 'react-router-dom'
import Checkbox from '@mui/material/Checkbox'
import { useTable } from '~/hooks/admin/article/useTable'
const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
import type { Props } from '~/hooks/admin/article/useTable'
import FormatDateTime from '../moment/FormatDateTime'
import TableContainer from '@mui/material/TableContainer'
import type { UpdatedBy } from '~/types/helper.type'
import Skeleton from '@mui/material/Skeleton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import type { AccountInfoInterface } from '~/types/account.type'

const ArticleTable = ({ selectedIds, setSelectedIds }: Props) => {
  const {
    loading,
    articles,
    handleToggleStatus,
    handleCheckbox,
    handleCheckAll,
    isCheckAll,
    open,
    handleOpen,
    handleClose,
    handleDelete
  } = useTable({ selectedIds, setSelectedIds })

  if (loading) {
    return (
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table size='small' sx={{
          borderCollapse: 'collapse',
          '& th, & td': {
            border: '1px solid #757575' // đường kẻ
          }
        }}>
          <TableHead>
            <TableRow>
              <TableCell align='center' sx={{ backgroundColor: '#003459', padding: '0px 2px' }}>
                <Checkbox
                  checked={isCheckAll}
                  onChange={(event) => handleCheckAll(event.target.checked)}
                  {...label}
                  size="small"
                  sx={{ padding: 0 }}
                />
              </TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Hình ảnh</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '0px' }}>Tên bài viết</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Trạng thái</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Người tạo / Ngày tạo</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Cập nhật lần cuối</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 5 }).map((_item, index) => (
              <TableRow key={index}>
                <TableCell align='center'>
                  <div className='flex items-center justify-center'>
                    <Skeleton variant="rectangular" width={20} height={20} sx={{ bgcolor: 'grey.400', padding: '0px 8px' }}/>
                  </div>
                </TableCell>
                <TableCell align='center'>
                  <div className='flex items-center justify-center'>
                    <Skeleton variant="rectangular" width={70} height={70} sx={{ bgcolor: 'grey.400' }}/>
                  </div>
                </TableCell>
                <TableCell align='center'>
                  <div className='flex items-center justify-center'>
                    <Skeleton variant="text" width={200} height={32} sx={{ bgcolor: 'grey.400' }}/>
                  </div>
                </TableCell>
                <TableCell align='center'>
                  <div className='flex items-center justify-center'>
                    <Skeleton variant="rectangular" width={85} height={32} sx={{ bgcolor: 'grey.400' }}/>
                  </div>
                </TableCell>
                <TableCell align='center' className='font-[700] '>
                  <div className='flex items-center justify-center'>
                    <Skeleton variant="rectangular" width={150} height={40} sx={{ bgcolor: 'grey.400' }}/>
                  </div>
                </TableCell>
                <TableCell align='center'>
                  <div className='flex items-center justify-center'>
                    <Skeleton variant="rectangular" width={150} height={40} sx={{ bgcolor: 'grey.400' }}/>
                  </div>
                </TableCell>
                <TableCell align='center'>
                  <div className='flex items-center justify-center'>
                    <Skeleton variant="rectangular" width={150} height={32} sx={{ bgcolor: 'grey.400' }}/>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <>
      {articles && articles.length > 0 ? (
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table size='small' sx={{
            borderCollapse: 'collapse',
            '& th, & td': {
              border: '1px solid #757575' // đường kẻ
            }
          }}>
            <TableHead>
              <TableRow>
                <TableCell align='center' sx={{ backgroundColor: '#003459', padding: '0px 2px' }}>
                  <Checkbox
                    checked={isCheckAll}
                    onChange={(event) => handleCheckAll(event.target.checked)}
                    {...label}
                    size="small"
                    sx={{ padding: 0 }}
                  />
                </TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Hình ảnh</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '0px' }}>Tên bài viết</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Trạng thái</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Người tạo / Ngày tạo</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Cập nhật lần cuối</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles
                .map((article, index) => (
                  <TableRow key={index}>
                    <TableCell align='center' sx={{ padding: '0px 2px' }}>
                      <Checkbox
                        checked={selectedIds.includes(article._id ?? '')}
                        onChange={(event) => handleCheckbox(article._id ?? '', event.target.checked)}
                        {...label}
                        size="small"
                        sx={{ padding: 0 }}
                        value={article._id}
                      />
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '10px 0px' }}>
                      <div className='flex justify-center items-center'>
                        <img src={article.thumbnail} alt={article.title} className='w-[70px] h-[70px]'/>
                      </div>
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '10px', width: '240px' }}>
                      <span className='line-clamp-1 font-[600] text-[14px]'>{article.title}</span>
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '6px 0px' }}>
                      <button
                        onClick={() => handleToggleStatus(article._id ?? '', article.status)}
                        className={`cursor-pointer border rounded-[5px] p-[5px] text-white 
                          ${article.status === 'ACTIVE' ? 'bg-[#18BA2A]' : 'bg-[#BC3433]'}`}
                      >
                        {article.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động'}
                      </button>
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '6px 0px' }} className='font-[700] '>{(() => {
                      const creator = article.createdBy.account_id as AccountInfoInterface
                      return creator ? (
                        <>
                          <span className="text-sm font-medium text-gray-800">
                            {creator.fullName}
                          </span>
                          <FormatDateTime time={article.createdAt}/>
                        </>
                      ) : (
                        <span className="text-sm italic text-gray-400">Không xác định</span>
                      )
                    })()}
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '6px 0px' }}>
                      {(() => {
                        const updatedBy = article.updatedBy?.[(article.updatedBy as UpdatedBy[]).length - 1]
                        if (!updatedBy) {
                          return (
                            <>
                              <p className="text-xs italic text-gray-400">Chưa có ai cập nhật</p>
                            </>
                          )
                        }
                        if (Array.isArray(article.updatedBy) && article.updatedBy.length > 0) {
                          const updater = updatedBy?.account_id as AccountInfoInterface
                          return updater ? (
                            <>
                              <span className="text-sm font-medium text-gray-800">
                                {updater.fullName}
                              </span>
                              <FormatDateTime time={updatedBy.updatedAt}/>
                            </>
                          ) : (
                            <span className="text-sm italic text-gray-400">
                            Không xác định
                            </span>
                          )
                        }
                      })()}
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '6px 0px' }}>
                      <Link
                        to={`/admin/articles/detail/${article._id}`}
                        className='border rounded-[5px] bg-[#0542AB] p-[5px] text-white'>
                      Chi tiết
                      </Link>
                      <Link
                        to={`/admin/articles/edit/${article._id}`}
                        className='border rounded-[5px] bg-[#FFAB19] p-[5px] text-white'>
                      Sửa
                      </Link>
                      <button
                        onClick={() => handleOpen(article._id ?? '')}
                        className='cursor-pointer border rounded-[5px] bg-[#BC3433] p-[5px] text-white'>
                      Xóa
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="delete-dialog-title"
            >
              <DialogTitle id="delete-dialog-title">Xác nhận xóa</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Bạn có chắc chắn muốn xóa bài viết này không?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Hủy</Button>
                <Button onClick={handleDelete} color="error" variant="contained">
                    Xóa
                </Button>
              </DialogActions>
            </Dialog>
          </Table>
        </TableContainer>
      ) : (
        <div className='flex items-center justify-center'>Không tồn tại danh mục bài viết nào.</div>
      )}
    </>
  )
}

export default ArticleTable