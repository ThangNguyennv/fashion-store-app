import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { Link } from 'react-router-dom'
import Checkbox from '@mui/material/Checkbox'
import { useTable, type Props } from '~/hooks/admin/order/useTable'
const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
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
import { getTotalBill } from '~/helpers/totalBill.helper'
import type { OrderStatus } from '~/interfaces/order.interface'
import type { AccountInfoInterface } from '~/interfaces/account.interface'

const OrderTable = ({ selectedIds, setSelectedIds, filterOrder }: Props) => {

  const {
    orders,
    loading,
    handleChangeStatus,
    open,
    handleOpen,
    handleClose,
    handleCheckbox,
    handleCheckAll,
    isCheckAll,
    handleDelete,
    pagination
  } = useTable({ selectedIds, setSelectedIds, filterOrder })

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
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Trạng thái đơn</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Thanh toán</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Phương thức</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Ngày tạo</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Cập nhật lần cuối</TableCell>
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
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Trạng thái đơn</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Thanh toán</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Phương thức</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Thời gian tạo</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Cập nhật lần cuối</TableCell>
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
                      <select
                        name="status"
                        value={order.status}
                        onChange={(event) => handleChangeStatus(order._id, event.target.value as OrderStatus)}
                        className='cursor-pointer outline-none border rounded-[5px] border-[#9D9995] p-[5px] bg-amber-100 text-black'
                      >
                        <option disabled value={''}>-- Chọn hành động --</option>
                        {filterOrder.map((item, idx) => (
                          <option key={idx} value={item.status}>{item.name}</option>
                        ))}
                      </select>
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
                    <TableCell align='center' sx={{ padding: '6px 0px' }}>
                      {(() => {
                        const updatedBy = order.updatedBy?.[(order.updatedBy as UpdatedBy[]).length - 1]
                        if (!updatedBy) {
                          return (
                            <>
                              <p className="text-xs italic text-gray-400">Chưa có ai cập nhật</p>
                            </>
                          )
                        }
                        if (Array.isArray(order.updatedBy) && order.updatedBy.length > 0) {
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
                      <>
                        <Link
                          to={`/admin/orders/detail/${order._id}`}
                          className='nav-link border rounded-[5px] bg-[#0542AB] p-[5px] text-white'
                        >
                            Chi tiết
                        </Link>
                        <button
                          onClick={() => handleOpen(order._id)}
                          className='border rounded-[5px] bg-[#BC3433] p-[5px] text-white'
                        >
                            Xóa
                        </button>
                      </>
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
                  Bạn có chắc chắn muốn xóa đơn hàng này không?
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
        <div className='flex items-center justify-center'>Không tồn tại đơn hàng nào.</div>
      )}
    </>
  )
}

export default OrderTable