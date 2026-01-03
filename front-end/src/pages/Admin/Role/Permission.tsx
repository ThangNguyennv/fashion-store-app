import { TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import React from 'react'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import usePermission from '~/hooks/Admin/role/usePermission'


const Permission = () => {
  const {
    permissionSections,
    roles,
    loading,
    role,
    handleCheckboxChange,
    handleSubmit,
    permissionsData
  } = usePermission()

  if (loading) {
    return (
      <div className='flex flex-col gap-[5px] bg-[#FFFFFF] p-[15px] shadow-md mt-[20px]'>
        <Skeleton variant="text" width={110} height={38} sx={{ bgcolor: 'grey.400' }}/>
        <div className='flex flex-col gap-[10px]'>
          <div className="flex items-center justify-end">
            <Skeleton variant="rectangular" width={90} height={32} sx={{ bgcolor: 'grey.400' }}/>
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
                <TableRow>
                  <TableCell sx={{
                    position: 'sticky',
                    width: 250,
                    height: 80,
                    backgroundImage: 'linear-gradient(to top right, transparent 49%, black 50%, transparent 51%)'
                  }}>
                    <Box sx={{ position: 'absolute', top: 40, left: 15 }}>
                      <Skeleton variant="text" width={90} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </Box>
                    <Box sx={{ position: 'absolute', bottom: 30, right: 15 }}>
                      <Skeleton variant="text" width={90} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </Box>
                  </TableCell>
                  {Array.from({ length: 4 }).map((_item, index) => (
                    <TableCell key={index} align='center'>
                      <Skeleton variant="text" width={110} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: 4 }).map((_item, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell sx={{ background: '#192335', color: 'white' }}>
                        <Skeleton variant="text" width={110} height={32} sx={{ bgcolor: 'grey.400' }}/>
                      </TableCell>
                    </TableRow>
                    {Array.from({ length: 2 }).map((_item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontWeight: '500' }}>
                          <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                        </TableCell>
                        {Array.from({ length: 4 }).map((_item, index) => (
                          <TableCell key={index} align="center">
                            <Skeleton variant="rectangular" width={13} height={13} sx={{ bgcolor: 'grey.400' }}/>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    )
  }

  return (
    <>
      {role && role.permissions.includes('roles_permissions') && (
        roles && roles.length > 0 ? (
          <div className='flex flex-col gap-[5px] bg-[#FFFFFF] p-[15px] shadow-md h-[800px] fixed w-[80%]'>
            <h1 className='text-[24px] font-[600] text-[#192335]'>Phân quyền</h1>
            <div className='flex flex-col gap-[10px]'>
              <div className="flex items-center justify-end">
                <button
                  onClick={handleSubmit}
                  className="border rounded-[5px] bg-[#525FE1] text-white p-[7px] text-[14px]"
                >
                  Cập nhật
                </button>
              </div>
              <TableContainer sx={{ maxHeight: 650 }}>
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
                    <TableRow>
                      <TableCell sx={{
                        position: 'sticky',
                        width: 250,
                        height: 80,
                        backgroundImage: 'linear-gradient(to top right, transparent 49%, black 50%, transparent 51%)'
                      }}>
                        <Box sx={{ position: 'absolute', top: 40, left: 15 }}>Phân loại</Box>
                        <Box sx={{ position: 'absolute', bottom: 30, right: 15 }}>Nhóm quyền</Box>
                      </TableCell>
                      {roles.map((role, index) => (
                        <TableCell key={index} align='center'>{role.title}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody >
                    {permissionsData.length > 0 && permissionSections.map((section, index) => (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell sx={{ background: '#192335', color: 'white' }}>
                            <b>{section.title}</b>
                          </TableCell>
                        </TableRow>
                        {section.permissions.map((permission, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ fontWeight: '500' }}>{permission.label}</TableCell>
                            {permissionsData.map((role, roleIndex) => (
                              <TableCell key={roleIndex} align="center">
                                <input
                                  type="checkbox"
                                  checked={role.permissions.includes(permission.key)}
                                  onChange={(event) => handleCheckboxChange(roleIndex, permission.key, event.target.checked)}
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        ) : (
          <div>
            Chưa có nhóm quyền nào, vui lòng click vào tạo nhóm quyền để tạo nhóm quyền mới
            <br />
            <Link
              to="/admin/roles/create"
              className="nav-link border rounded-[5px] bg-[#525FE1] text-white p-[7px]"
            >
              Đi tới tạo nhóm quyền
            </Link>
          </div>
        )
      )}
    </>
  )
}

export default Permission