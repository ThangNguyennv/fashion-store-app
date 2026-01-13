import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import { useTableTrash, type Props } from '~/hooks/admin/order/useTrashTable'
const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
import FormatDateTime from '../moment/FormatDateTime'
import TableContainer from '@mui/material/TableContainer'
import Skeleton from '@mui/material/Skeleton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { getTotalBill } from '~/helpers/totalBill.helper'
import type { AccountInfoInterface } from '~/interfaces/account.interface'

const OrderTrashTable = ({ selectedIds, setSelectedIds }: Props) => {

  const {
    orders,
    loading,
    openPermanentlyDelete,
    handleOpenPermanentlyDelete,
    handleClosePermanentlyDelete,
    handleCheckbox,
    handleCheckAll,
    isCheckAll,
    handleRecover,
    handlePermanentlyDelete,
    pagination
  } = useTableTrash({ selectedIds, setSelectedIds })

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
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '0px' }}>Mã đơn</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Khách hàng</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Tổng tiền</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Trạng thái cũ</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Thanh toán</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Phương thức</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Thời gian tạo</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Thời gian xóa</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 10 }).map((_item, index) => (
              <TableRow key={index}>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={20} height={20} sx={{ bgcolor: 'grey.400', padding: '0px 2px' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="text" width={245} height={24} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="text" width={61} height={17} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="text" width={61} height={17} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={76} height={32} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="text" width={61} height={17} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="text" width={61} height={17} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center' className='font-[700] '>
                  <Skeleton variant="text" width={155} height={20} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center' className='font-[700] '>
                  <Skeleton variant="text" width={155} height={50} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center' className='font-[700] '>
                  <Skeleton variant="rectangular" width={110} height={29} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
  if (!orders || orders.length === 0) {
    return (
      <div className='flex items-center justify-center'>Không tồn tại đơn hàng nào.</div>
    )
  }
  return (
    <>
      {orders && orders.length > 0 ? (
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table size='small' sx={{
            borderCollapse: 'collapse',
            '& th, & td': {
              border: '1px solid #757575', // đường kẻ
              fontSize: '14px'
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
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '0px' }}>STT</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '0px' }}>Mã đơn</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Khách hàng</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Tổng tiền</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Trạng thái cũ</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Thanh toán</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Phương thức</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Thời gian tạo</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Thời gian xóa</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders
                .map((order, index) => (
                  <TableRow key={index}>
                    <TableCell align='center' sx={{ padding: '0px 2px' }}>
                      <Checkbox
                        checked={selectedIds.includes(order._id)}
                        onChange={(event) => handleCheckbox(order._id, event.target.checked)}
                        {...label}
                        size="small"
                        sx={{ padding: 0 }}
                        value={order._id}
                      />
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '0px 2px' }}>
                      {(pagination.currentPage - 1) * pagination.limitItems + index + 1}
                    </TableCell>
                    <TableCell sx={{ padding: '6px 0px', width: '250px' }}>
                      <div className='flex items-center justify-center font-[600] text-[16px] hover:underline'>
                        {order._id}
                      </div>
                    </TableCell>
                    <TableCell align='center' className='font-[700]' sx={{ padding: '6px 0px' }}>
                      <span>{order.userInfo.fullName}</span>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: '6px 0px' }}>
                      {Math.floor(getTotalBill(order)).toLocaleString()}đ
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '6px 0px' }}>
                      {order.status}
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '6px 0px' }}>
                      {order.paymentInfo.status === 'FAILED' ? (
                        <span className='text-red-600 font-[600] text-[16px]'>Thất bại</span>
                      ) : (
                        order.paymentInfo.status === 'PENDING' ? (
                          <span className='text-yellow-600 font-[600] text-[16px]'>Chưa thanh toán</span>
                        ) : (
                          <span className='text-green-600 font-[600] text-[16px]'>Đã thanh toán</span>
                        )
                      )}
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '6px 0px' }}>
                      {order.paymentInfo.method === 'VNPAY' ? (
                        <span className='uppercase font-[600] text-[16px]'>VNPAY</span>
                      ) : (
                        order.paymentInfo.method === 'ZALOPAY' ? (
                          <span className='uppercase font-[600] text-[16px]'>ZALOPAY</span>
                        ) : (
                          order.paymentInfo.method === 'MOMO' ? (
                            <span className='uppercase font-[600] text-[16px]'>MOMO</span>
                          ) : (
                            <span className='uppercase font-[600] text-[16px]'>COD</span>
                          )
                        )
                      )}
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '6px 0px' }} className='font-[700] '>
                      <FormatDateTime time={order.createdAt}/>
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '6px 0px' }} className='font-[700] '>{(() => {
                      const deletor = order.deletedBy?.account_id as AccountInfoInterface
                      return deletor ? (
                        <>
                          <span className="text-sm font-medium text-gray-800">
                            {deletor.fullName}
                          </span>
                          <FormatDateTime time={order.deletedBy?.deletedAt}/>
                        </>
                      ) : (
                        <span className="text-sm italic text-gray-400">Không xác định</span>
                      )
                    })()}
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '6px 0px' }}>
                      <>
                        <button
                          onClick={() => handleRecover(order._id)}
                          className='nav-link border rounded-[5px] bg-[#525FE1] p-[5px] text-white'
                        >
                            Khôi phục
                        </button>
                        <button
                          onClick={() => handleOpenPermanentlyDelete(order._id)}
                          className='border rounded-[5px] bg-[#BC3433] p-[5px] text-white'
                        >
                            Xóa vĩnh viễn
                        </button>
                      </>

                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <Dialog
              open={openPermanentlyDelete}
              onClose={handleClosePermanentlyDelete}
              aria-labelledby="delete-dialog-title"
            >
              <DialogTitle id="delete-dialog-title">Xác nhận xóa</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này không?
                  (Một khi xóa sẽ không thể khôi phục lại được.)
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClosePermanentlyDelete}>Hủy</Button>
                <Button onClick={handlePermanentlyDelete} color="error" variant="contained">
                    Xóa
                </Button>
              </DialogActions>
            </Dialog>
          </Table>
        </TableContainer>
      ) : (
        <div className='flex items-center justify-center'>Không tồn tại đơn hàng nào.</div>
      )}
    </>
  )
}

export default OrderTrashTable