import Pagination from '~/components/admin/pagination/Pagination'
import Search from '~/components/admin/search/Search'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import { IoArrowBackSharp } from 'react-icons/io5'
import { PRODUCTTRASH_STATUSES_CHANGEMULTI } from '~/utils/constants'
import { useProductTrash } from '~/hooks/admin/product/useProductTrash'
import ProductTrashTable from '~/components/admin/itemTable/ProductTrashTable'
import SortProduct from '~/components/admin/sort/SortProduct'

const TrashProduct = () => {
  const {
    dispatchProduct,
    products,
    pagination,
    keyword,
    sortKey,
    sortValue,
    selectedIds,
    setSelectedIds,
    actionType,
    setActionType,
    updateParams,
    handleSubmit,
    handleSort,
    clearSortParams,
    open,
    handleClose,
    handleConfirmDeleteAll,
    role
  } = useProductTrash()

  return (
    <>
      {role && role.permissions.includes('orders_view') && (
        <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[15px] shadow-md h-[820px] fixed w-[80%]'>
          <div className='flex items-center justify-between'>
            <h1 className='text-[24px] font-[700] text-[#000000]'>Thùng rác của sản phẩm</h1>
            <button className=''>
              <Link to={'/admin/products'} className='border rounded-[5px] p-[5px] flex items-center justify-between gap-[5px]'>
                <IoArrowBackSharp />
                Quay lại
              </Link>
            </button>
          </div>
          <div className='text-[20px] font-[500] text-[#000000] pb-[15px] px-[15px] shadow-md flex flex-col gap-[10px]'>
            <div className='flex items-center justify-between text-[15px]'>
              <div className='flex items-center justify-center gap-[15px]'>
                <div className='border rounded-[5px] p-[5px]'>Đã chọn: {selectedIds.length}</div>
              </div>
              <Search
                keyword={keyword}
                handleChangeKeyword={(value) => dispatchProduct({ type: 'SET_DATA', payload: { keyword: value } })}
                handleSearch={(keyword) => updateParams({ keyword })}
              />
            </div>
          </div>
          <div className='flex items-center justify-between text-[15px]'>
            <form onSubmit={(event) => handleSubmit(event)} className='flex gap-[5px]'>
              <select
                name="type"
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className='cursor-pointer outline-none border rounded-[5px] border-[#9D9995] p-[5px]'
              >
                <option disabled value={''}>-- Chọn hành động --</option>
                {PRODUCTTRASH_STATUSES_CHANGEMULTI.map((status, idx) => (
                  <option key={idx} value={status.value}>{status.label}</option>
                ))}
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
                    Bạn có chắc chắn muốn xóa vĩnh viễn {selectedIds.length} sản phẩm này không? (Một khi đã xóa là không thể khôi phục lại được.)
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
            <div className='flex items-center justify-center gap-[15px]'>
              <SortProduct
                handleSort={handleSort}
                sortKey={sortKey}
                sortValue={sortValue}
                clearSortParams={clearSortParams}
              />
            </div>
          </div>
          <ProductTrashTable
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
          <Pagination
            pagination={pagination}
            handlePagination={(page: number) => updateParams({ page })}
            handlePaginationPrevious={(page: number) => updateParams({ page: page - 1 })}
            handlePaginationNext={(page: number) => updateParams({ page: page + 1 })}
            items={products ?? []}
          />
        </div>
      )}
    </>
  )
}

export default TrashProduct