import Pagination from '~/components/Admin/Pagination/Pagination'
import Search from '~/components/Admin/Search/Search'
import SortOrder from '~/components/Admin/Sort/SortOrder'
import { useOrder } from '~/hooks/Admin/Order/useOrder'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import FilterStatusOrder from '~/components/Admin/FilterStatus/FilterStatusOrder'
import OrderTable from '~/components/Admin/ItemTable/OrderTable'
import type { OrderStatus } from '~/types/order.type'
import { FaTrashAlt } from 'react-icons/fa'
import { FaFileExcel } from 'react-icons/fa'
import { API_ROOT } from '~/utils/constants'
import { Link } from 'react-router-dom'

const OrderAdmin = () => {
  const {
    dispatchOrder,
    filterOrder,
    pagination,
    keyword,
    sortKey,
    sortValue,
    selectedIds,
    setSelectedIds,
    actionType,
    setActionType,
    status,
    updateParams,
    handleSubmit,
    handleSort,
    clearSortParams,
    handleFilterStatus,
    open,
    handleClose,
    handleConfirmDeleteAll,
    role,
    allOrders,
    orders
  } = useOrder()

  return (
    <>
      {role && role.permissions.includes('orders_view') && (
        <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[15px] shadow-md h-[820px] fixed w-[80%]'>
          <h1 className='text-[24px] font-[700] text-[#000000]'>Danh sách đơn hàng</h1>
          <div className='text-[20px] font-[500] text-[#000000] pb-[15px] px-[15px] shadow-md flex flex-col gap-[10px]'>
            <div className='flex items-center justify-between text-[15px]'>
              <div className='flex items-center justify-center gap-[15px]'>
                <FilterStatusOrder
                  filterOrder={filterOrder}
                  currentStatus={status as OrderStatus}
                  handleFilterStatus={handleFilterStatus}
                  items={allOrders ?? []}
                />
              </div>
              <Search
                keyword={keyword}
                handleChangeKeyword={(value) => dispatchOrder({ type: 'SET_DATA', payload: { keyword: value } })}
                handleSearch={(keyword) => updateParams({ keyword })}
              />
            </div>
          </div>
          <div className='flex items-center justify-between text-[15px]'>
            <div className='flex items-center justify-center gap-[15px]'>
              <form onSubmit={(event) => handleSubmit(event)} className='flex gap-[5px]'>
                <select
                  name="type"
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className='cursor-pointer outline-none border rounded-[5px] border-[#9D9995] p-[5px]'
                >
                  <option disabled value={''}>-- Chọn hành động --</option>
                  <option value="PENDING">Đang xử lý</option>
                  <option value="TRANSPORTING">Đang giao hàng</option>
                  <option value="CONFIRMED">Hoàn thành</option>
                  <option value="CANCELED">Hủy</option>
                  <option value="DELETEALL">Xóa</option>
                </select>
                <button
                  type="submit"
                  className='border rounded-[5px] border-[#9D9995] p-[5px] bg-[#96D5FE]'
                >
                Áp dụng
                </button>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="delete-dialog-title"
                >
                  <DialogTitle id="delete-dialog-title">Xác nhận xóa</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                    Bạn có chắc chắn muốn xóa {selectedIds.length} đơn hàng này không?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleConfirmDeleteAll} color="error" variant="contained">
                    Xóa
                    </Button>
                  </DialogActions>
                </Dialog>
              </form>
              <div className='border rounded-[5px] p-[5px]'>Đã chọn: {selectedIds.length}</div>
            </div>
            <div className='flex items-center justify-center gap-[15px]'>
              <button className=''>
                <Link to={'/admin/orders/trash'} className='p-[5px] border rounded-[5px] border-[#525FE1] hover:bg-[#525FE1] flex items-center justify-center gap-[5px]'>
                  <FaTrashAlt />
                  <span>Thùng rác</span>
                </Link>
              </button>
              <a
                href={`${API_ROOT}/admin/orders/export?status=${status}`}
                download={`don-hang-${status || 'all'}.xlsx`}
                className='p-[5px] border rounded-[5px] border-green-600 text-green-600 hover:bg-green-600 hover:text-white flex items-center justify-center gap-[5px]'
              >
                <FaFileExcel />
                <span>Xuất Excel</span>
              </a>
              <SortOrder
                handleSort={handleSort}
                sortKey={sortKey}
                sortValue={sortValue}
                clearSortParams={clearSortParams}
              />
            </div>
          </div>
          <OrderTable
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
          <Pagination
            pagination={pagination}
            handlePagination={(page: number) => updateParams({ page })}
            handlePaginationPrevious={(page: number) => updateParams({ page: page - 1 })}
            handlePaginationNext={(page: number) => updateParams({ page: page + 1 })}
            items={orders ?? []}
          />
        </div>
      )}
    </>
  )
}

export default OrderAdmin