/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchDetailArticleCategoryAPI, fetchEditArticleCategoryAPI } from '~/apis/admin/articleCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useArticleCategoryContext } from '~/contexts/admin/ArticleCategoryContext'
import type { ArticleCategoryDetailInterface } from '~/types/articleCategory.type'
import { useAuth } from '~/contexts/admin/AuthContext'
import { editArticleCategorySchema, type EditArticleCategoryFormData } from '~/validations/admin/article-category.validate'

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
  } = useForm<EditArticleCategoryFormData>({
    resolver: zodResolver(editArticleCategorySchema),
    defaultValues: {
      title: '',
      parent_id: '',
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
        const data: ArticleCategoryDetailInterface = await fetchDetailArticleCategoryAPI(id)
        const articleCategory = data.articleCategory

        reset({
          title: articleCategory.title || '',
          parent_id: String(articleCategory.parent_id || ''),
          descriptionShort: articleCategory.descriptionShort || '',
          descriptionDetail: articleCategory.descriptionDetail || '',
          status: articleCategory.status || 'ACTIVE',
          thumbnail: articleCategory.thumbnail || null
        })

        setThumbnailPreview(articleCategory.thumbnail || null)
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

  const onSubmit = async (data: EditArticleCategoryFormData): Promise<void> => {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('parent_id', data.parent_id || '')
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

    const response = await fetchEditArticleCategoryAPI(id, formData)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate(`/admin/articles-category/detail/${id}`)
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