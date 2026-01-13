import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { Link } from 'react-router-dom'
import Checkbox from '@mui/material/Checkbox'
import { useTable } from '~/hooks/admin/product/useTable'
const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
import type { Props } from '~/hooks/admin/product/useTable'
import FormatDateTime from '../moment/FormatDateTime'
import TableContainer from '@mui/material/TableContainer'
import type { UpdatedBy } from '~/interfaces/helper.interface'
import Skeleton from '@mui/material/Skeleton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import type { AccountInfoInterface } from '~/interfaces/account.interface'

const ProductTable = ({ selectedIds, setSelectedIds }: Props) => {
  const {
    products,
    isLoading,
    handleToggleStatus,
    open,
    handleOpen,
    handleClose,
    handleDelete,
    handleCheckbox,
    handleCheckAll,
    isCheckAll,
    pagination
  } = useTable({ selectedIds, setSelectedIds })

  if (isLoading) {
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
              <TableCell align='center' sx={{ backgroundColor: '#003459', padding: '0px 2px' }}>
                STT
              </TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Hình ảnh</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '0px' }}>Tên sản phẩm</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Giá cuối (đ)</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Giá gốc (đ)</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Giảm giá (%)</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Số lượng</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Trạng thái</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Người tạo / Thời gian tạo</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Cập nhật lần cuối</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 5 }).map((_item, index) => (
              <TableRow key={index}>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={20} height={20} sx={{ bgcolor: 'grey.400', padding: '0px 2px' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={20} height={20} sx={{ bgcolor: 'grey.400', padding: '0px 2px' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={70} height={70} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="text" width={219} height={32} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align="center">
                  <Skeleton variant="text" width={70} height={40} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align="center">
                  <Skeleton variant="text" width={70} height={40} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={50} height={26} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={50} height={26} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={85} height={32} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center' className='font-[700] '>
                  <Skeleton variant="rectangular" width={150} height={40} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={150} height={40} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={150} height={32} sx={{ bgcolor: 'grey.400' }}/>
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
      {products && products.length > 0 ? (
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
                <TableCell align='center' sx={{ backgroundColor: '#003459', padding: '0px 2px' }}>
                STT
                </TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Hình ảnh</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '0px' }}>Tên sản phẩm</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Giá cuối (đ)</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Giá gốc (đ)</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Giảm giá (%)</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Số lượng</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Trạng thái</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Người tạo / Thời gian tạo</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Cập nhật lần cuối</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products
                .map((product, index) => (
                  <TableRow key={index}>
                    <TableCell align='center' sx={{ padding: '0px 2px' }}>
                      <Checkbox
                        checked={selectedIds.includes(product._id ?? '')}
                        onChange={(event) => handleCheckbox(product._id ?? '', event.target.checked)}
                        {...label}
                        size="small"
                        sx={{ padding: 0 }}
                        value={product._id}
                      />
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '0px 2px' }}>
                      {(pagination.currentPage - 1) * pagination.limitItems + index + 1}
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '10px 0px' }}>
                      <div className='flex justify-center items-center'>
                        <img src={product.thumbnail} alt={product.title} className='w-[70px] h-[70px]'/>
                      </div>
                    </TableCell>
                    <TableCell align='left' sx={{ padding: '10px', width: '240px' }}>
                      <span className='line-clamp-1 font-[600] text-[14px]'>{product.title}</span>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: '6px 0px' }}>
                      {Math.floor(product.price * (100 - product.discountPercentage) / 100).toLocaleString()}đ
                    </TableCell>
                    <TableCell align="center" sx={{ padding: '6px 0px' }}>{product.price.toLocaleString()}đ</TableCell>
                    <TableCell align="center" sx={{ padding: '6px 0px' }}>{product.discountPercentage.toLocaleString()}%</TableCell>
                    <TableCell align="center" sx={{ padding: '6px 0px' }}>{product.stock.toLocaleString()}</TableCell>
                    <TableCell align='center' sx={{ padding: '6px 0px' }}>
                      <button
                        onClick={() => handleToggleStatus(product._id ?? '', product.status)}
                        className={`border rounded-[5px] p-[5px] text-white 
                          ${product.status === 'ACTIVE' ? 'bg-[#18BA2A]' : 'bg-[#BC3433]'}`}
                      >
                        {product.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động'}
                      </button>
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '6px 0px' }} className='font-[700] '>{(() => {
                      const creator = product.createdBy?.account_id as AccountInfoInterface
                      return creator ? (
                        <>
                          <span className="text-sm font-medium text-gray-800">
                            {creator.fullName}
                          </span>
                          <FormatDateTime time={product.createdAt}/>
                        </>
                      ) : (
                        <span className="text-sm italic text-gray-400">Không xác định</span>
                      )
                    })()}
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '6px 0px' }}>
                      {(() => {
                        const updatedBy = product.updatedBy?.[(product.updatedBy as UpdatedBy[]).length - 1]
                        if (!updatedBy) {
                          return (
                            <>
                              <p className="text-xs italic text-gray-400">Chưa có ai cập nhật</p>
                            </>
                          )
                        }
                        if (Array.isArray(product.updatedBy) && product.updatedBy.length > 0) {
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
                    <TableCell align='center' sx={{ padding: '6px 0px' }} >
                      <Link
                        to={`/admin/products/detail/${product._id}`}
                        className='nav-link border rounded-[5px] bg-[#0542AB] p-[5px] text-white'
                      >
                        Chi tiết
                      </Link>
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white'
                      >
                          Sửa
                      </Link>
                      <button
                        onClick={() => handleOpen(product._id ?? '')}
                        className='border rounded-[5px] bg-[#BC3433] p-[5px] text-white'
                      >
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
                    Bạn có chắc chắn muốn xóa sản phẩm này không?
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
        <div className="flex items-center justify-center">Không tồn tại sản phẩm nào.</div>
      )}
    </>
  )
}

export default ProductTable