/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailAccountAPI, fetchEditAccountAPI } from '~/apis/admin/account.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { AccountAPIResponse } from '~/interfaces/account.interface'
import type { RoleInfoInterface } from '~/interfaces/role.interface'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editAccountSchema, type EditAccountFormData } from '~/validations/admin/account.validation'

const useEdit = () => {
  const [roles, setRoles] = useState<RoleInfoInterface[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const { role } = useAuth()
  const [preview, setPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<EditAccountFormData>({
    resolver: zodResolver(editAccountSchema),
    defaultValues: {
      status: 'ACTIVE'
    }
  })

  const watchedStatus = watch('status')

  // Fetch account details
  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response: AccountAPIResponse = await fetchDetailAccountAPI(id)
        const acc = response.account
        setRoles(response.roles)

        reset({
          fullName: acc.fullName,
          email: acc.email,
          phone: acc.phone || '',
          role_id: acc.role_id._id,
          status: acc.status,
          password: ''
        })

        setPreview(acc.avatar)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: {
            message: 'Không thể tải thông tin tài khoản. Vui lòng thử lại!',
            severity: 'error'
          }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, reset, dispatchAlert])

  // Cleanup blob URL to prevent memory leak
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Vui lòng chọn file ảnh hợp lệ', severity: 'error' }
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Kích thước ảnh không được vượt quá 5MB', severity: 'error' }
      })
      return
    }

    // Revoke old preview URL if exists
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    setValue('avatar', file)
    setPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data: EditAccountFormData) => {
    if (!id) return

    try {
      const formData = new FormData()

      formData.append('fullName', data.fullName)
      formData.append('email', data.email)
      formData.append('role_id', data.role_id)
      formData.append('status', data.status)
      formData.append('phone', data.phone)

      if (data.password && data.password.trim() !== '') {
        formData.append('password', data.password)
      }

      if (data.avatar instanceof File) {
        formData.append('avatar', data.avatar)
      }

      const response = await fetchEditAccountAPI(id, formData)

      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => navigate(`/admin/accounts/detail/${id}`), 1500)
      } else {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message || 'Cập nhật thất bại', severity: 'error' }
        })
      }
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: {
          message: 'Đã có lỗi xảy ra. Vui lòng thử lại!',
          severity: 'error'
        }
      })
    }
  }
  return {
    roles,
    isLoading,
    role,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    watchedStatus,
    handleImageChange,
    onSubmit,
    preview,
    navigate,
    id
  }
}

export default useEdit