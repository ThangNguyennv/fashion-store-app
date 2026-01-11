/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, type ChangeEvent } from 'react'
import { fetchMyAccountAPI, fetchUpdateMyAccountAPI } from '~/apis/admin/myAccount.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { MyAccountAPIResponse } from '~/types/account.type'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { editMyAccountSchema, type EditMyAccountFormData } from '~/validations/admin/myAccount.validate'

export const useEditMyAccount = () => {
  const { dispatchAlert } = useAlertContext()
  const [isLoading, setIsLoading] = useState(true)
  const [preview, setPreview] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm<EditMyAccountFormData>({
    resolver: zodResolver(editMyAccountSchema)
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data: MyAccountAPIResponse = await fetchMyAccountAPI()
        const account = data.myAccount
        reset({
          fullName: account.fullName,
          email: account.email,
          phone: account.phone,
          password: ''
        })
        setPreview(account.avatar)
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
  }, [reset, dispatchAlert])

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

  const onSubmit = async (data: EditMyAccountFormData) => {
    try {
      const formData = new FormData()

      formData.append('fullName', data.fullName)
      formData.append('email', data.email)
      formData.append('phone', data.phone)

      if (data.password && data.password.trim() !== '') {
        formData.append('password', data.password)
      }

      if (data.avatar instanceof File) {
        formData.append('avatar', data.avatar)
      }
      const response = await fetchUpdateMyAccountAPI(formData)

      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => {
          window.location.href = '/admin/my-account' // Fix load lại trang sau!
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
        payload: {
          message: 'Đã có lỗi xảy ra. Vui lòng thử lại!',
          severity: 'error'
        }
      })
    }
  }

  return {
    isLoading,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleImageChange,
    onSubmit,
    navigate,
    preview
  }
}