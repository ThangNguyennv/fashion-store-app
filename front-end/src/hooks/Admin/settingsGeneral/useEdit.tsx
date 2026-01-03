/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchEditSettingGeneralAPI, fetchSettingGeneralAPI } from '~/apis/admin/settingGeneral.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { SettingGeneralAPIResponse } from '~/types/setting.type'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const editSettingsGeneralSchema = z.object({
  websiteName: z.string()
    .trim()
    .min(1, 'Tên website là bắt buộc!')
    .max(50, 'Tên website không được quá 50 ký tự!')
    .regex(
      /^[\p{L}\p{N}\s._&'-]+$/u,
      'Tên website chỉ chứa chữ, số và các ký tự đặc biệt (._&\'-)!'
    )
    .transform((val) => val.replace(/\s+/g, ' ')),

  email: z.string()
    .trim()
    .lowercase()
    .min(1, 'Email là bắt buộc!')
    .pipe(z.email('Email không hợp lệ!')),

  phone: z.string()
    .trim()
    .min(1, 'Số điện thoại là bắt buộc!')
    .refine(
      val => /^(0[35789]\d{8}|\+84[35789]\d{8})$/.test(val),
      { message: 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03/05/07/08/09 hoặc +84)!' }
    ),

  address: z.string()
    .trim()
    .min(1, 'Địa chỉ là bắt buộc!')
    .transform((val) => val.replace(/\s+/g, ' ')),

  copyright: z.string()
    .trim()
    .min(1, 'Thông tin bản quyền là bắt buộc!')
    .transform((val) => val.replace(/\s+/g, ' ')),

  logo: z.any().optional()
})

type EditSettingGeneralFormData = z.infer<typeof editSettingsGeneralSchema>

const useEditSettingsGeneral = () => {
  const { dispatchAlert } = useAlertContext()
  const [isLoading, setIsLoading] = useState(true)
  const [preview, setPreview] = useState<string | null>(null)

  const navigate = useNavigate()
  const {
    register, // Register form fields
    handleSubmit, // Handle form submission
    formState: { errors, isSubmitting }, // Form state (errors, isSubmitting, etc.)
    reset, // Reset form values
    setValue // Set form field values
  } = useForm<EditSettingGeneralFormData>({
    resolver: zodResolver(editSettingsGeneralSchema) // Use Zod schema for validation
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res: SettingGeneralAPIResponse = await fetchSettingGeneralAPI()
        const settingGeneralData = res.settingGeneral[0]
        reset({
          websiteName: settingGeneralData.websiteName,
          email: settingGeneralData.email,
          phone: settingGeneralData.phone,
          address: settingGeneralData.address,
          copyright: settingGeneralData.copyright
        })
        setPreview(settingGeneralData.logo)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Lỗi khi tải thông tin cài đặt chung!', severity: 'error' }
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

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Vui lòng chọn một tệp hình ảnh hợp lệ.', severity: 'error' }
      })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Kích thước tệp hình ảnh không được vượt quá 5MB.', severity: 'error' }
      })
      return
    }

    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    setValue('logo', file)
    setPreview(URL.createObjectURL(file))
  }
  const onSubmit = async (data: EditSettingGeneralFormData) => {
    try {
      const formData = new FormData()
      formData.append('websiteName', data.websiteName)
      formData.append('email', data.email)
      formData.append('phone', data.phone)
      formData.append('address', data.address)
      formData.append('copyright', data.copyright)

      if (data.logo instanceof File) {
        formData.append('logo', data.logo)
      }
      const response = await fetchEditSettingGeneralAPI(formData)
      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => {
          navigate('/admin/settings/general')
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
    preview,
    navigate
  }
}

export default useEditSettingsGeneral