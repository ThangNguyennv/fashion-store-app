import { useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchCreateArticleCategoryAPI } from '~/apis/admin/articleCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useArticleCategoryContext } from '~/contexts/admin/ArticleCategoryContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { createArticleCategorySchema, type CreateArticleCategoryFormData } from '~/validations/admin/articleCategory.validation'

export const useCreate = () => {
  const {
    register,
    handleSubmit: handleSubmitForm,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<CreateArticleCategoryFormData>({
    resolver: zodResolver(createArticleCategorySchema),
    defaultValues: {
      title: '',
      parent_id: '',
      descriptionShort: '',
      descriptionDetail: '',
      status: 'ACTIVE',
      thumbnail: null
    }
  })

  const { stateArticleCategory } = useArticleCategoryContext()
  const { dispatchAlert } = useAlertContext()
  const { allArticleCategories } = stateArticleCategory
  const { role } = useAuth()
  const navigate = useNavigate()
  const [preview, setPreview] = useState<string | null>(null)
  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)

  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate
      if (file.size > 5 * 1024 * 1024) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Kích thước ảnh không được vượt quá 5MB', severity: 'error' }
        })
        return
      }
      if (!file.type.startsWith('image/')) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Vui lòng chọn file ảnh', severity: 'error' }
        })
        return
      }

      // Cleanup old preview
      if (preview) URL.revokeObjectURL(preview)

      setPreview(URL.createObjectURL(file))
      setValue('thumbnail', file)
    }
  }

  const onSubmit = async (data: CreateArticleCategoryFormData): Promise<void> => {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('parent_id', data.parent_id || '')
    formData.append('descriptionShort', data.descriptionShort || '')
    formData.append('descriptionDetail', data.descriptionDetail || '')
    formData.append('status', data.status)

    if (data.thumbnail instanceof File) {
      formData.append('thumbnail', data.thumbnail)
    }

    const response = await fetchCreateArticleCategoryAPI(formData)
    if (response.code === 201) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/admin/articles-category')
      }, 2000)
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    uploadImageInputRef.current?.click()
  }

  return {
    allArticleCategories,
    uploadImageInputRef,
    preview,
    handleThumbnailChange,
    handleClick,
    handleSubmit: handleSubmitForm(onSubmit),
    role,
    // React Hook Form
    register,
    errors,
    isSubmitting,
    setValue,
    watch
  }
}