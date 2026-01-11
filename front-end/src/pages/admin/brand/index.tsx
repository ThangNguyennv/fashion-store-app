import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import useBrand from '~/hooks/admin/brand/useBrand'

const BrandAdmin = () => {
  const {
    brands,
    loading,
    openDeleteDialog,
    Link,
    handleDelete,
    handleOpenDelete,
    handleCloseDelete
  } = useBrand()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Thương hiệu</h1>
        <Button
          component={Link}
          to="/admin/brands/create"
          variant="contained"
          color="primary"
        >
          Thêm mới
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Logo</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">Đang tải...</TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand._id}>
                  <TableCell>
                    <img src={brand.thumbnail} alt={brand.title} className="w-16 h-16 object-contain" />
                  </TableCell>
                  <TableCell>{brand.title}</TableCell>
                  <TableCell>
                    <span className={brand.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}>
                      {brand.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    <Button component={Link} to={`/admin/brands/edit/${brand._id}`} size="small" sx={{ mr: 1 }}>Sửa</Button>
                    <Button onClick={() => handleOpenDelete(brand._id!)} size="small" color="error">Xóa</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Pagination pagination={pagination} /> */}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDelete}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent><DialogContentText>Bạn có chắc chắn muốn xóa thương hiệu này không?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Hủy</Button>
          <Button onClick={handleDelete} color="error">Xóa</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default BrandAdmin
