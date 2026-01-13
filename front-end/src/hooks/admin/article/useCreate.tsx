import { useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCreateArticleAPI } from '~/apis/admin/article.api'
import { useArticleCategoryContext } from '~/contexts/admin/ArticleCategoryContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createArticleSchema, type CreateArticleFormData } from '~/validations/admin/article.validation'

export const useCreate = () => {
  const {
    register,
    handleSubmit: handleSubmitForm,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<CreateArticleFormData>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      title: '',
      article_category_id: '',
      featured: '1',
      descriptionShort: '',
      descriptionDetail: '',
      status: 'ACTIVE',
      thumbnail: null
    }
  })

  const { stateArticleCategory } = useArticleCategoryContext()
  const { allArticleCategories } = stateArticleCategory
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const { role } = useAuth()

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

  const onSubmit = async (data: CreateArticleFormData): Promise<void> => {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('article_category_id', data.article_category_id)
    formData.append('featured', data.featured)
    formData.append('descriptionShort', data.descriptionShort || '')
    formData.append('descriptionDetail', data.descriptionDetail || '')
    formData.append('status', data.status)

    if (data.thumbnail instanceof File) {
      formData.append('thumbnail', data.thumbnail)
    }

    const response = await fetchCreateArticleAPI(formData)
    if (response.code === 201) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/admin/articles')
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