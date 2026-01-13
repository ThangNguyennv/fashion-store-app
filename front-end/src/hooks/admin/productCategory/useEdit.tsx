/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailProductCategoryAPI, fetchEditProductCategoryAPI } from '~/apis/admin/productCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import type { ProductCategoryDetailInterface } from '~/interfaces/productCategory.interface'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editProductCategorySchema, type EditProductCategoryFormData } from '~/validations/admin/productCategory.validation'

export const useEdit = () => {
  const params = useParams()
  const id = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const { stateProductCategory } = useProductCategoryContext()
  const { allProductCategories } = stateProductCategory
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const { role } = useAuth()

  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [originalThumbnail, setOriginalThumbnail] = useState<string | null>(null)

  const {
    register,
    handleSubmit: handleSubmitForm,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<EditProductCategoryFormData>({
    resolver: zodResolver(editProductCategorySchema),
    defaultValues: {
      title: '',
      parent_id: '',
      description: '',
      status: 'ACTIVE',
      thumbnail: null
    }
  })

  // Load data từ API
  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response: ProductCategoryDetailInterface = await fetchDetailProductCategoryAPI(id)
        const category = response.productCategory

        reset({
          title: category.title,
          parent_id: category.parent_id || '',
          description: category.description || '',
          status: category.status,
          thumbnail: category.thumbnail
        })

        setThumbnailPreview(category.thumbnail)
        setOriginalThumbnail(category.thumbnail)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: {
            message: 'Không thể tải thông tin danh mục. Vui lòng thử lại!',
            severity: 'error'
          }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, reset, dispatchAlert])

  // Cleanup blob URL
  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview)
      }
    }
  }, [thumbnailPreview])

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size
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
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview)
      }

      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
      setValue('thumbnail', file)
    }
  }

  const onSubmit = async (data: EditProductCategoryFormData): Promise<void> => {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('parent_id', data.parent_id || '')
    formData.append('description', data.description || '')
    formData.append('status', data.status)

    // Nếu có file mới, gửi file. Nếu không, giữ URL cũ
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile)
    } else {
      formData.append('thumbnail', originalThumbnail || '')
    }

    const response = await fetchEditProductCategoryAPI(id, formData)

    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate(`/admin/products-category/detail/${id}`)
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
    isLoading,
    allProductCategories,
    uploadImageInputRef,
    thumbnailPreview,
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