import { useRef, useState, useEffect, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCreateProductCategoryAPI } from '~/apis/admin/productCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productCategorySchema, type ProductCategoryFormData } from '~/validations/admin/productCategory.validation'

export const useCreate = () => {
  const { stateProductCategory } = useProductCategoryContext()
  const { dispatchAlert } = useAlertContext()
  const { allProductCategories } = stateProductCategory
  const { role } = useAuth()
  const navigate = useNavigate()

  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit: handleSubmitForm,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<ProductCategoryFormData>({
    resolver: zodResolver(productCategorySchema),
    defaultValues: {
      title: '',
      parent_id: '',
      description: '',
      status: 'ACTIVE',
      thumbnail: null
    }
  })

  // Cleanup blob URL khi unmount
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Kích thước ảnh không được vượt quá 5MB', severity: 'error' }
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Vui lòng chọn file ảnh', severity: 'error' }
        })
        return
      }

      // Cleanup old blob
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }

      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)
      setValue('thumbnail', file)
    }
  }

  const onSubmit = async (data: ProductCategoryFormData): Promise<void> => {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('parent_id', data.parent_id || '')
    formData.append('description', data.description || '')
    formData.append('status', data.status)
    formData.append('thumbnail', data.thumbnail)

    const response = await fetchCreateProductCategoryAPI(formData)

    if (response.code === 201) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/admin/products-category')
      }, 2000)
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message || 'Có lỗi xảy ra', severity: 'error' }
      })
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    uploadImageInputRef.current?.click()
  }

  return {
    allProductCategories,
    uploadImageInputRef,
    preview,
    handleChange,
    handleSubmit: handleSubmitForm(onSubmit),
    handleClick,
    role,
    register,
    errors,
    isSubmitting,
    setValue,
    watch
  }
}