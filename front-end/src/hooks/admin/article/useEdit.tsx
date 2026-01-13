/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchDetailArticleAPI, fetchEditArticleAPI } from '~/apis/admin/article.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useArticleCategoryContext } from '~/contexts/admin/ArticleCategoryContext'
import type { ArticleDetailInterface } from '~/interfaces/article.interface'
import { useAuth } from '~/contexts/admin/AuthContext'
import { editArticleSchema, type EditArticleFormData } from '~/validations/admin/article.validation'

export const useEdit = () => {
  const params = useParams()
  const id = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const { stateArticleCategory } = useArticleCategoryContext()
  const { allArticleCategories } = stateArticleCategory
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const { role } = useAuth()

  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit: handleSubmitForm,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    trigger
  } = useForm<EditArticleFormData>({
    resolver: zodResolver(editArticleSchema),
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

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data: ArticleDetailInterface = await fetchDetailArticleAPI(id)
        const article = data.article

        reset({
          title: article.title || '',
          article_category_id: String(article.article_category_id || ''),
          featured: article.featured || '1',
          descriptionShort: article.descriptionShort || '',
          descriptionDetail: article.descriptionDetail || '',
          status: article.status || 'ACTIVE',
          thumbnail: article.thumbnail || null
        })

        setThumbnailPreview(article.thumbnail || null)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: {
            message: 'Không thể tải thông tin bài viết. Vui lòng thử lại!',
            severity: 'error'
          }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, reset, dispatchAlert])

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

      // Cleanup old preview if it's a blob URL
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview)
      }

      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
      setValue('thumbnail', file)
      trigger('thumbnail')
    }
  }

  const onSubmit = async (data: EditArticleFormData): Promise<void> => {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('article_category_id', data.article_category_id)
    formData.append('featured', data.featured)
    formData.append('descriptionShort', data.descriptionShort || '')
    formData.append('descriptionDetail', data.descriptionDetail || '')
    formData.append('status', data.status)

    // Chỉ append file nếu có upload mới
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile)
    } else if (typeof data.thumbnail === 'string') {
      // Giữ URL ảnh cũ
      formData.append('thumbnail', data.thumbnail)
    }

    const response = await fetchEditArticleAPI(id, formData)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate(`/admin/articles/detail/${id}`)
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
    isLoading,
    allArticleCategories,
    uploadImageInputRef,
    thumbnailPreview,
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