/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom'
import { fetchCreateRoleAPI } from '~/apis/admin/role.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const roleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Tiêu đề không được để trống!')
    .max(100, 'Tiêu đề không được quá 100 ký tự'),

  titleId: z
    .string()
    .trim()
    .min(1, 'Tiêu đề không được để trống!')
    .max(50, 'Mã định danh không được quá 50 ký tự'),

  description: z.string().optional()
})


export type RoleFormData = z.infer<typeof roleSchema>

const useCreate = () => {
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const { role } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      title: '',
      titleId: '',
      description: ''
    }
  })

  const onSubmit = async (data: RoleFormData) => {
    try {
      const response = await fetchCreateRoleAPI(data)

      if (response.code === 201) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => {
          navigate('/admin/roles')
        }, 2000)
      }
    } catch (error: any) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: {
          message: error?.response?.data?.message || 'Tạo mới thất bại',
          severity: 'error'
        }
      })
    }
  }

  return {
    role,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    setValue,
    watch
  }
}

export default useCreate