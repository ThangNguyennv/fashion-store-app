/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailRoleAPI, fetchEditRoleAPI } from '~/apis/admin/role.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const editRoleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Tiêu đề không được để trống!')
    .max(100, 'Tiêu đề không được quá 100 ký tự'),
  titleId: z
    .string()
    .trim()
    .min(1, 'Mã định danh không được để trống!')
    .max(50, 'Mã định danh không được quá 50 ký tự'),
  description: z.string().optional()
})

export type EditRoleFormData = z.infer<typeof editRoleSchema>

const useEdit = () => {
  const params = useParams()
  const id = params.id as string
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const { role } = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isLoading } // isLoading của hook-form cho biết đang chờ defaultValues
  } = useForm<EditRoleFormData>({
    resolver: zodResolver(editRoleSchema)
  })

  // Fetch dữ liệu cũ và đổ vào Form
  useEffect(() => {
    if (!id) return
    fetchDetailRoleAPI(id).then((response) => {
      if (response?.role) {
        // Dùng reset để map toàn bộ data vào các field tương ứng
        reset({
          title: response.role.title,
          titleId: response.role.titleId,
          description: response.role.description
        })
      }
    })
  }, [id, reset])

  const onSubmit = async (data: EditRoleFormData) => {
    try {
      const response = await fetchEditRoleAPI(id, data)
      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => {
          navigate(`/admin/roles/detail/${id}`)
        }, 2000)
      } else {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message || 'Cập nhật thất bại', severity: 'error' }
        })
      }
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Cập nhật thất bại', severity: 'error' }
      })
    }
  }

  return {
    handleSubmit: handleSubmit(onSubmit),
    register,
    errors,
    isSubmitting,
    role, // Dùng để check quyền
    setValue,
    watch,
    // Kiểm tra xem đã load được dữ liệu cũ chưa
    hasData: !!watch('title'),
    isLoading
  }
}

export default useEdit