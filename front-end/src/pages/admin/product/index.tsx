import FilterStatus from '~/components/admin/filterStatus/FilterStatus'
import Pagination from '~/components/admin/pagination/Pagination'
import ProductTable from '~/components/admin/itemTable/ProductTable'
import Search from '~/components/admin/search/Search'
import { useProduct } from '~/hooks/admin/product/useProduct'
import { Link } from 'react-router-dom'
import SortProduct from '~/components/admin/sort/SortProduct'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { FaTrashAlt } from 'react-icons/fa'
import { PRODUCT_STATUSES_CHANGEMULTI } from '~/utils/constants'

const ProductAdmin = () => {
  const {
    dispatchProduct,
    products,
    allProducts,
    filterStatus,
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
    role
  } = useProduct()

  return (
    <>
      {role && role.permissions.includes('products_view') && (
        <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[15px] shadow-md fixed w-[82%]'>
          <h1 className='text-[24px] font-[700] text-[#000000]'>Danh sách sản phẩm</h1>
          <div className='text-[20px] font-[500] text-[#000000] pb-[15px] px-[15px] shadow-md flex flex-col gap-[10px]'>
            <div className='flex items-center justify-between text-[15px]'>
              <FilterStatus
                filterStatus={filterStatus}
                currentStatus={status}
                handleFilterStatus={handleFilterStatus}
                items={allProducts}
              />
              <Search
                keyword={keyword}
                handleChangeKeyword={(value) => dispatchProduct({ type: 'SET_DATA', payload: { keyword: value } })}
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
                  {PRODUCT_STATUSES_CHANGEMULTI.map((status, idx) => (
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
                    Bạn có chắc chắn muốn xóa {selectedIds.length} sản phẩm này không?
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
                <Link to={'/admin/products/trash'} className='p-[5px] border rounded-[5px] border-[#525FE1] hover:bg-[#525FE1] flex items-center justify-center gap-[5px]'>
                  <FaTrashAlt />
                  <span>Thùng rác</span>
                </Link>
              </button>
              <SortProduct
                handleSort={handleSort}
                sortKey={sortKey}
                sortValue={sortValue}
                clearSortParams={clearSortParams}
              />
              <div>
                <Link
                  to={'/admin/products/create'}
                  className='nav-link border rounded-[5px] px-[15px] py-[5px] border-[#607D00] font-[700] bg-[#607D00] text-white'
                >
                + Thêm mới
                </Link>
              </div>
            </div>
          </div>
          <ProductTable
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
          <Pagination
            pagination={pagination}
            handlePagination={(page: number) => updateParams({ page: page })}
            handlePaginationPrevious={(page: number) => updateParams({ page: page - 1 })}
            handlePaginationNext={(page: number) => updateParams({ page: page + 1 })}
            items={products}
          />
        </div>
      )}
    </>
  )
}

export default ProductAdmin