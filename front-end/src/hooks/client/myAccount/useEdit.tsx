import { useRef, useEffect, useState } from 'react'
import { fetchEditInfoUserAPI } from '~/apis/client/user.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useAuth } from '~/contexts/client/AuthContext'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editProfileSchema, type EditProfileFormData } from '~/validations/client/myAccount.validation'

const useEdit = () => {
  const { accountUser, setAccountUser } = useAuth()
  const { dispatchAlert } = useAlertContext()

  // Chỉ giữ lại ref cho input để trigger click, bỏ ref preview vì dùng state
  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)

  // State lưu preview ảnh
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue, // Lấy thêm setValue để set file thủ công
    formState: { errors, isSubmitting }
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema)
  })

  // Effect 1: Đổ dữ liệu user vào form khi load trang
  useEffect(() => {
    if (accountUser) {
      reset({
        fullName: accountUser.fullName,
        email: accountUser.email,
        phone: accountUser.phone || '',
        address: accountUser.address || ''
      })
      // Set ảnh hiện tại của user vào preview
      setPreviewAvatar(accountUser.avatar || null)
    }
  }, [accountUser, reset])

  // Effect 2: Cleanup blob URL để tránh memory leak khi đổi ảnh liên tục
  useEffect(() => {
    return () => {
      if (previewAvatar && previewAvatar.startsWith('blob:')) {
        URL.revokeObjectURL(previewAvatar)
      }
    }
  }, [previewAvatar])

  // Hàm xử lý khi chọn ảnh (Logic tương tự editMyAccount)
  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 1. Validate loại file
    if (!file.type.startsWith('image/')) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Vui lòng chọn file ảnh hợp lệ!', severity: 'error' }
      })
      return
    }

    // 2. Validate kích thước (Ví dụ 5MB)
    if (file.size > 5 * 1024 * 1024) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Kích thước ảnh không được vượt quá 5MB!', severity: 'error' }
      })
      return
    }

    // 3. Set vào form và tạo preview
    setValue('avatar', file) // Cập nhật giá trị cho React Hook Form
    setPreviewAvatar(URL.createObjectURL(file))
  }

  const onSubmit: SubmitHandler<EditProfileFormData> = async (data) => {
    if (!accountUser) return

    const formData = new FormData()
    formData.append('fullName', data.fullName)
    formData.append('email', data.email)
    formData.append('phone', data.phone)
    formData.append('address', data.address || '')

    // Lấy file từ data của form (do đã setValue ở trên)
    if (data.avatar instanceof File) {
      formData.append('avatar', data.avatar)
    }

    const response = await fetchEditInfoUserAPI(formData)

    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })

      // Cập nhật lại context Auth
      setAccountUser({
        ...accountUser,
        ...data,
        // Nếu có file mới thì dùng URL blob tạm thời để hiển thị ngay,
        // hoặc lý tưởng nhất là server trả về URL ảnh mới trong response
        avatar: data.avatar instanceof File ? URL.createObjectURL(data.avatar) : accountUser.avatar
      })
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

  const handleClickUpload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    uploadImageInputRef.current?.click()
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    handleClickUpload,
    handleChangeImage,
    accountUser,
    uploadImageInputRef,
    previewAvatar // Trả về biến này để hiển thị ở component View (thay vì ref)
  }
}

export default useEdit