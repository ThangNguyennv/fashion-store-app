import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
import ArticleTree from '../tableTree/ArticleTree'
import TableContainer from '@mui/material/TableContainer'
import { useTable, type Props } from '~/hooks/admin/articleCategory/useTable'
import Skeleton from '@mui/material/Skeleton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContentText from '@mui/material/DialogContentText'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

const ArticleCategoryTable = ({ selectedIds, setSelectedIds }: Props) => {
  const {
    loading,
    dispatchArticleCategory,
    articleCategories,
    accounts,
    handleToggleStatus,
    handleDelete,
    handleCheckbox,
    handleCheckAll,
    isCheckAll,
    open,
    handleOpen,
    handleClose,
    pagination
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
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>
                STT
              </TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>
                Hình ảnh
              </TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>
                Tiêu đề
              </TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>
                Trạng thái
              </TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>
                Người tạo / Ngày tạo
              </TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>
                Cập nhật lần cuối
              </TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 5 }).map((_item, index) => (
              <TableRow key={index}>
                <TableCell align='center'>
                  <div className='flex items-center justify-center'>
                    <Skeleton variant="rectangular" width={20} height={20} sx={{ bgcolor: 'grey.400', padding: '0px 2px' }}/>
                  </div>
                </TableCell>
                <TableCell align='center'>
                  <div className='flex items-center justify-center'>
                    <Skeleton variant="rectangular" width={70} height={70} sx={{ bgcolor: 'grey.400', padding: '10px 0px' }}/>
                  </div>
                </TableCell>
                <TableCell align='center'>
                  <div className='flex items-center justify-center'>
                    <Skeleton variant="text" width={220} height={32} sx={{ bgcolor: 'grey.400' }}/>
                  </div>
                </TableCell>
                <TableCell align='center'>
                  <div className='flex items-center justify-center'>
                    <Skeleton variant="rectangular" width={70} height={32} sx={{ bgcolor: 'grey.400' }}/>
                  </div>
                </TableCell>
                <TableCell align='center' className='font-[700] '>
                  <div className='flex items-center justify-center'>
                    <Skeleton variant="rectangular" width={170} height={40} sx={{ bgcolor: 'grey.400' }}/>
                  </div>
                </TableCell>
                <TableCell align='center'>
                  <div className='flex items-center justify-center'>
                    <Skeleton variant="rectangular" width={170} height={40} sx={{ bgcolor: 'grey.400' }}/>
                  </div>
                </TableCell>
                <TableCell align='center'>
                  <div className='flex items-center justify-center'>
                    <Skeleton variant="rectangular" width={200} height={32} sx={{ bgcolor: 'grey.400' }}/>
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
      {articleCategories && articleCategories.length > 0 ? (
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table size="small" stickyHeader sx={{
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
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>STT</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Hình ảnh</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '0px' }}>Tiêu đề</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Trạng thái</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Người tạo / Ngày tạo</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Cập nhật lần cuối</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articleCategories.map((articleCategory, idx) => (
                <ArticleTree
                  key={articleCategory._id}
                  index={idx}
                  pagination={pagination}
                  articleCategory={articleCategory}
                  level={1}
                  selectedIds={selectedIds}
                  accounts={accounts}
                  handleCheckbox={handleCheckbox}
                  handleToggleStatus={handleToggleStatus}
                  handleDelete={handleDelete}
                  articleCategories={articleCategories}
                  dispatchArticleCategory={dispatchArticleCategory}
                  open={open}
                  handleOpen={handleOpen}
                  handleClose={handleClose}
                />
              ))}
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="delete-dialog-title"
              >
                <DialogTitle id="delete-dialog-title">Xác nhận xóa</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Bạn có chắc chắn muốn xóa danh mục này không?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Hủy</Button>
                  <Button onClick={handleDelete} color="error" variant="contained">
                  Xóa
                  </Button>
                </DialogActions>
              </Dialog>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className='flex items-center justify-center'>Không tồn tại danh mục bài viết nào.</div>
      )}
    </>
  )
}

export default ArticleCategoryTable