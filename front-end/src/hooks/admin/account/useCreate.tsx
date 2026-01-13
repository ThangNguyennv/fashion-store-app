/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchAccountsAPI, fetchCreateAccountAPI } from '~/apis/admin/account.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { AccountsAPIResponse } from '~/interfaces/account.interface'
import type { RoleInfoInterface } from '~/interfaces/role.interface'
import { accountSchema, type AccountFormData } from '~/validations/admin/account.validation'

const useCreate = () => {
  const [roles, setRoles] = useState<RoleInfoInterface[]>([])
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const { role } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phone: '',
      status: 'ACTIVE',
      role_id: ''
    }
  })

  useEffect(() => {
    fetchAccountsAPI().then((response: AccountsAPIResponse) => {
      setRoles(response.roles)
    })
  }, [])

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate image size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Kích thước ảnh không được vượt quá 5MB', severity: 'error' }
        })
        return
      }

      // Validate image type
      if (!file.type.startsWith('image/')) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Vui lòng chọn file ảnh', severity: 'error' }
        })
        return
      }

      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)
      setValue('avatar', file)
    }
  }

  const onSubmit = async (data: AccountFormData): Promise<void> => {
    try {
      const formData = new FormData()

      formData.append('fullName', data.fullName)
      formData.append('email', data.email)
      formData.append('password', data.password)
      formData.append('status', data.status)
      formData.append('role_id', data.role_id)
      formData.append('phone', data.phone)

      const file = uploadImageInputRef.current?.files?.[0]
      if (file) {
        formData.append('avatar', file)
      }

      const response = await fetchCreateAccountAPI(formData)

      if (response.code === 201) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => {
          navigate('/admin/accounts')
        }, 2000)
      } else {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'error' }
        })
      }
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Đã có lỗi xảy ra', severity: 'error' }
      })
    }
  }

  const handleClickUpload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    uploadImageInputRef.current?.click()
  }
  return {
    roles,
    preview,
    role,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleImageChange,
    onSubmit,
    handleClickUpload,
    uploadImageInputRef,
    navigate
  }
}

export default useCreate