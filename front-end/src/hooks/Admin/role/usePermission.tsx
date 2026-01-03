import { useEffect, useState } from 'react'
import { fetchPermissions, fetchRoleAPI } from '~/apis/admin/role.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { PermissionsInterface, RoleInfoInterface, RolesResponseInterface } from '~/types/role.type'
import { useAuth } from '~/contexts/admin/AuthContext'

const permissionSections = [
  {
    title: 'Thống kê',
    permissions: [
      { key: 'statistics_view', label: 'Xem' }
    ]
  },
  {
    title: 'Danh sách đơn hàng',
    permissions: [
      { key: 'orders_view', label: 'Xem' },
      { key: 'orders_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Thùng rác của đơn hàng',
    permissions: [
      { key: 'orders-trash_view', label: 'Xem' },
      { key: 'orders-trash_delete', label: 'Xóa' },
      { key: 'orders-trash_recover', label: 'Khôi phục' }
    ]
  },
  {
    title: 'Danh mục sản phẩm',
    permissions: [
      { key: 'products-category_view', label: 'Xem' },
      { key: 'products-category_create', label: 'Thêm mới' },
      { key: 'products-category_edit', label: 'Chỉnh sửa' },
      { key: 'products-category_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Thùng rác của danh mục sản phẩm',
    permissions: [
      { key: 'products-category-trash_view', label: 'Xem' },
      { key: 'products-category-trash_delete', label: 'Xóa' },
      { key: 'products-category-trash_recover', label: 'Khôi phục' }
    ]
  },
  {
    title: 'Danh sách sản phẩm',
    permissions: [
      { key: 'products_view', label: 'Xem' },
      { key: 'products_create', label: 'Thêm mới' },
      { key: 'products_edit', label: 'Chỉnh sửa' },
      { key: 'products_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Thùng rác của sản phẩm',
    permissions: [
      { key: 'products-trash_view', label: 'Xem' },
      { key: 'products-trash_delete', label: 'Xóa' },
      { key: 'products-trash_recover', label: 'Khôi phục' }
    ]
  },
  {
    title: 'Danh mục bài viết',
    permissions: [
      { key: 'articles-category_view', label: 'Xem' },
      { key: 'articles-category_create', label: 'Thêm mới' },
      { key: 'articles-category_edit', label: 'Chỉnh sửa' },
      { key: 'articles-category_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Danh sách bài viết',
    permissions: [
      { key: 'articles_view', label: 'Xem' },
      { key: 'articles_create', label: 'Thêm mới' },
      { key: 'articles_edit', label: 'Chỉnh sửa' },
      { key: 'articles_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Danh sách thương hiệu',
    permissions: [
      { key: 'brands_view', label: 'Xem' },
      { key: 'brands_create', label: 'Thêm mới' },
      { key: 'brands_edit', label: 'Chỉnh sửa' },
      { key: 'brands_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Nhóm quyền',
    permissions: [
      { key: 'roles_view', label: 'Xem' },
      { key: 'roles_create', label: 'Thêm mới' },
      { key: 'roles_edit', label: 'Chỉnh sửa' },
      { key: 'roles_delete', label: 'Xóa' },
      { key: 'roles_permissions', label: 'Phân quyền' }
    ]
  },
  {
    title: 'Tài khoản admin',
    permissions: [
      { key: 'accounts_view', label: 'Xem' },
      { key: 'accounts_create', label: 'Thêm mới' },
      { key: 'accounts_edit', label: 'Chỉnh sửa' },
      { key: 'accounts_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Tài khoản người dùng',
    permissions: [
      { key: 'users_view', label: 'Xem' },
      { key: 'users_edit', label: 'Chỉnh sửa' },
      { key: 'users_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Cài đặt chung',
    permissions: [
      { key: 'settings-general_view', label: 'Xem' }
    ]
  },
  {
    title: 'Cài đặt nâng cao',
    permissions: [
      { key: 'settings-advance_view', label: 'Xem' }
    ]
  }
]

const usePermission = () => {
  const [roles, setRoles] = useState<RoleInfoInterface[]>([])
  const [permissionsData, setPermissionsData] = useState<PermissionsInterface[]>([])
  const { dispatchAlert } = useAlertContext()
  const [loading, setLoading] = useState(false)
  const { role } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res: RolesResponseInterface = await fetchRoleAPI()
        setRoles(res.roles)
        setPermissionsData(res.roles.map(role => ({ _id: String(role._id), permissions: role.permissions || [] })))
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Fetch roles error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCheckboxChange = (roleIndex: number, permKey: string, checked: boolean) => {
    setPermissionsData((prev) => {
      return prev.map((item, index) => {
        if (index !== roleIndex) return item //  Không cùng role
        const newPermission = checked ? [...item.permissions, permKey] : item.permissions.filter(p => p !== permKey)
        return { ...item, permissions: newPermission } // ghi đè permissions mới
      })
    })
  }

  const handleSubmit = async () => {
    try {
      const response = await fetchPermissions(permissionsData)
      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
      }
    } catch (error) {
      alert('error'+ error)
    }
  }
  return {
    permissionSections,
    roles,
    loading,
    role,
    handleCheckboxChange,
    handleSubmit,
    permissionsData
  }
}

export default usePermission