import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { Link } from 'react-router-dom'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import useAccount from '~/hooks/Admin/account/useAccount'

const Account = () => {
  const {
    accounts,
    roles,
    open,
    loading,
    role,
    handleToggleStatus,
    handleOpen,
    handleClose,
    handleDelete
  } = useAccount()

  if (loading) {
    return (
      <div className='flex flex-col gap-[10px] bg-[#FFFFFF] p-[15px] shadow-md mt-[15px]'>
        <Skeleton variant="text" width={270} height={32} sx={{ bgcolor: 'grey.400' }}/>
        <div className="flex items-center justify-end">
          <Skeleton variant="rectangular" width={120} height={32} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader sx={{
            borderCollapse: 'collapse',
            '& th, & td': {
              border: '1px solid #000000', // đường kẻ,
              zIndex: 1
            },
            '& th': {
              backgroundColor: '#252733', // nền header
              color: '#fff',
              zIndex: 2,
              borderTop: '1px solid #000000 !important',
              borderBottom: '1px solid #000000 !important'
            }
          }}>
            <TableHead>
              <TableRow className='bg-gray-100'>
                <TableCell align='center'>STT</TableCell>
                <TableCell align='center'>Avatar</TableCell>
                <TableCell align='center'>Họ và tên</TableCell>
                <TableCell align='center'>Quyền</TableCell>
                <TableCell align='center'>Email</TableCell>
                <TableCell align='center'>Số điện thoại</TableCell>
                <TableCell align='center'>Trạng thái</TableCell>
                <TableCell align='center'>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 4 }).map((_item, index) => (
                <TableRow key={index}>
                  <TableCell align='center'>
                    <div className='flex items-center justify-center'>
                      <Skeleton variant="text" width={20} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </div>
                  </TableCell>
                  <TableCell align='center'>
                    <div className='flex items-center justify-center'>
                      <Skeleton variant="circular" width={100} height={100} sx={{ bgcolor: 'grey.400' }}/>
                    </div>
                  </TableCell>
                  <TableCell align='center'>
                    <div className='flex items-center justify-center'>
                      <Skeleton variant="text" width={150} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </div>
                  </TableCell>
                  <TableCell align='center'>
                    <div className='flex items-center justify-center'>
                      <Skeleton variant="text" width={150} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </div>
                  </TableCell>
                  <TableCell align='center'>
                    <div className='flex items-center justify-center'>
                      <Skeleton variant="text" width={150} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </div>
                  </TableCell>
                  <TableCell align='center'>
                    <div className='flex items-center justify-center'>
                      <Skeleton variant="text" width={150} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </div>
                  </TableCell>
                  <TableCell align='center'>
                    <div className='flex items-center justify-center'>
                      <Skeleton variant="rectangular" width={90} height={32} sx={{ bgcolor: 'grey.400' }}/>
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
      </div>
    )
  }

  return (
    <>
      {role && role.permissions.includes('accounts_view') && (
        <div className='flex flex-col gap-[10px] bg-[#FFFFFF] p-[15px] shadow-md mt-[15px]'>
          <h1 className="text-[24px] font-[700] text-[#000000]">Danh sách tài khoản admin</h1>
          <div className="flex items-center justify-end">
            <Link
              to={'/admin/accounts/create'}
              className="nav-link border rounded-[5px] px-[15px] py-[5px] border-[#607D00] font-[700] bg-[#607D00] text-white"
            >
            + Thêm mới
            </Link>
          </div>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader sx={{
              borderCollapse: 'collapse',
              '& th, & td': {
                border: '1px solid #000000', // đường kẻ,
                zIndex: 1
              },
              '& th': {
                backgroundColor: '#252733', // nền header
                color: '#fff',
                zIndex: 2,
                borderTop: '1px solid #000000 !important',
                borderBottom: '1px solid #000000 !important'
              }
            }}>
              <TableHead>
                <TableRow className='bg-gray-100'>
                  <TableCell align='center'>STT</TableCell>
                  <TableCell align='center'>Avatar</TableCell>
                  <TableCell align='center'>Họ và tên</TableCell>
                  <TableCell align='center'>Quyền</TableCell>
                  <TableCell align='center'>Email</TableCell>
                  <TableCell align='center'>Số điện thoại</TableCell>
                  <TableCell align='center'>Trạng thái</TableCell>
                  <TableCell align='center'>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts && (
                  accounts.map((account, index) => (
                    <TableRow key={index}>
                      <TableCell align='center'>{index + 1}</TableCell>
                      <TableCell align='center'>
                        <div className='flex items-center justify-center'>
                          <img src={account.avatar} className='border rounded-[50%] w-[100px] h-[100px]'/>
                        </div>
                      </TableCell>
                      <TableCell align='center'>{account.fullName}</TableCell>
                      <TableCell align='center'>
                        {roles.map((role) => (
                          account.role_id === role._id ? role.title : ''
                        ))}
                      </TableCell>
                      <TableCell align='center'>{account.email}</TableCell>
                      <TableCell align='center'>{account.phone}</TableCell>
                      <TableCell align='center'>
                        <button
                          onClick={() => handleToggleStatus(account._id, account.status)}
                          className={`cursor-pointer border rounded-[5px] p-[5px] text-white 
                          ${account.status === 'ACTIVE' ? 'bg-[#18BA2A]' : 'bg-[#BC3433]'}`}
                        >
                          {account.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động'}
                        </button>
                      </TableCell>
                      <TableCell align='center'>
                        <Link
                          to={`/admin/accounts/detail/${account._id}`}
                          className='nav-link border rounded-[5px] bg-[#0542AB] p-[5px] text-white'
                        >
                          Chi tiết
                        </Link>
                        <Link
                          to={`/admin/accounts/edit/${account._id}`}
                          className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white'
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() => handleOpen(account._id)}
                          className='nav-link border rounded-[5px] bg-[#BC3433] p-[5px] text-white'
                        >
                          Xóa
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="delete-dialog-title"
                >
                  <DialogTitle id="delete-dialog-title">Xác nhận xóa</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                    Bạn có chắc chắn muốn xóa tài khoản này không?
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
        </div>
      )}
    </>
  )
}

export default Account