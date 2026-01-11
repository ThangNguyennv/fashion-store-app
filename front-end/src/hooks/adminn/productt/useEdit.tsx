/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailProductAPI, fetchEditProductAPI } from '~/apis/admin/product.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import type { ProductDetailInterface } from '~/types/product.type'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { availableColors, availableSizes } from '~/utils/constants'
import { editProductSchema, type EditProductFormData } from '~/validations/admin/product.validate'

export const useEdit = () => {
  const params = useParams()
  const id = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const { stateProductCategory } = useProductCategoryContext()
  const { allProductCategories } = stateProductCategory
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const { role } = useAuth()

  const [showPopupSize, setShowPopupSize] = useState(false)
  const [showPopupColor, setShowPopupColor] = useState(false)
  const [tempSelectedColors, setTempSelectedColors] = useState<{
    name: string
    code: string
    images: (File | string)[]
      }[]>([])
  const [tempSelectedSizes, setTempSelectedSizes] = useState<string[]>([])

  // Refs
  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const colorFileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null) // Lưu File object gốc
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null) // Lưu URL để hiển thị

  const {
    register,
    handleSubmit: handleSubmitForm,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    trigger
  } = useForm<EditProductFormData>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      title: '',
      description: '',
      product_category_id: '',
      featured: '1',
      status: 'ACTIVE',
      price: 0,
      discountPercentage: 0,
      stock: 1,
      colors: [],
      sizes: [],
      thumbnail: null
    }
  })

  const watchedColors = watch('colors')
  const watchedSizes = watch('sizes')

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data: ProductDetailInterface = await fetchDetailProductAPI(id)
        const product = data.product

        // Reset form với data từ API
        reset({
          title: product.title,
          product_category_id: product.product_category_id,
          featured: product.featured,
          description: product.description || '',
          price: product.price,
          discountPercentage: product.discountPercentage || 0,
          stock: product.stock,
          colors: product.colors || [],
          sizes: product.sizes || [],
          status: product.status,
          thumbnail: product.thumbnail
        })

        // Set preview riêng cho thumbnail
        setThumbnailPreview(product.thumbnail)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: {
            message: 'Không thể tải thông tin sản phẩm. Vui lòng thử lại!',
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

      // Cleanup old preview nếu là blob URL
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview)
      }

      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
      setValue('thumbnail', file)
      trigger('thumbnail')
    }
  }

  // Phần xỬ lý colors
  const handleOpenPopupColor = () => {
    setTempSelectedColors([...watchedColors])
    setShowPopupColor(true)
  }

  const handleClosePopupColor = () => {
    setShowPopupColor(false)
    setTempSelectedColors([])
  }

  const handleToggleColor = (color: { code: string; name: string }) => {
    const isSelected = tempSelectedColors.some(c => c.code === color.code)

    if (isSelected) {
      setTempSelectedColors(tempSelectedColors.filter(c => c.code !== color.code))
    } else {
      setTempSelectedColors([...tempSelectedColors, { ...color, images: [] }])
    }
  }

  const handleSelectAllColors = () => {
    const allColors = availableColors.map(color => ({ ...color, images: [] }))
    setTempSelectedColors(allColors)
  }

  const handleDeselectAllColors = () => {
    setTempSelectedColors([])
  }

  const handleConfirmSelectionColors = () => {
    // Giữ lại images của các màu đã có
    const updatedColors = tempSelectedColors.map(tempColor => {
      const existingColor = watchedColors.find(c => c.code === tempColor.code)
      return existingColor ? existingColor : tempColor
    })

    setValue('colors', updatedColors)
    trigger('colors')
    setShowPopupColor(false)
    setTempSelectedColors([])
  }

  const handleAddImagesToColor = (colorIndex: number, event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files)

      // Validate
      for (const file of newFiles) {
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
      }

      const newColors = [...watchedColors]
      const updatedImages = (newColors[colorIndex].images || []).concat(newFiles)
      newColors[colorIndex] = { ...newColors[colorIndex], images: updatedImages }
      setValue('colors', newColors)
    }
  }

  const handleRemoveImageFromColor = (colorIndex: number, imageIndex: number) => {
    const newColors = [...watchedColors]
    const imageToRemove = newColors[colorIndex].images[imageIndex]

    // Cleanup blob URL nếu là File
    if (imageToRemove instanceof File) {
      URL.revokeObjectURL(URL.createObjectURL(imageToRemove))
    }

    const newImages = newColors[colorIndex].images.filter((_, idx) => idx !== imageIndex)
    newColors[colorIndex] = { ...newColors[colorIndex], images: newImages }
    setValue('colors', newColors)
  }

  const handleRemoveColor = (indexToRemove: number) => {
    const newColors = watchedColors.filter((_, index) => index !== indexToRemove)
    setValue('colors', newColors)
    trigger('colors')
  }
  // Hết Phần xỬ lý colors

  // Phần xử lý sizes
  const handleOpenPopupSize = () => {
    setTempSelectedSizes([...watchedSizes])
    setShowPopupSize(true)
  }

  const handleClosePopupSize = () => {
    setShowPopupSize(false)
    setTempSelectedSizes([])
  }

  const handleToggleSize = (size: string) => {
    const isSelected = tempSelectedSizes.some(s => s === size)

    if (isSelected) {
      setTempSelectedSizes(tempSelectedSizes.filter(s => s !== size))
    } else {
      setTempSelectedSizes([...tempSelectedSizes, size])
    }
  }

  const handleSelectAllSizes = () => {
    setTempSelectedSizes([...availableSizes])
  }

  const handleDeselectAllSizes = () => {
    setTempSelectedSizes([])
  }

  const handleConfirmSelectionSizes = () => {
    setValue('sizes', tempSelectedSizes)
    trigger('sizes')
    setShowPopupSize(false)
    setTempSelectedSizes([])
  }

  const handleRemoveSize = (indexToRemove: number) => {
    const newSizes = watchedSizes.filter((_, index) => index !== indexToRemove)
    setValue('sizes', newSizes)
    trigger('sizes')
  }
  // Hết Phần xử lý sizes

  // ===== SUBMIT =====
  const onSubmit = async (data: EditProductFormData): Promise<void> => {
    // Validate mỗi màu phải có ít nhất 1 ảnh
    const hasColorWithoutImages = data.colors.some(
      color => !color.images || color.images.length === 0
    )
    if (hasColorWithoutImages) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Mỗi màu phải có ít nhất 1 ảnh', severity: 'error' }
      })
      return
    }

    const formData = new FormData()
    const filesToUpload: File[] = []

    const productDataPayload = {
      ...data,
      thumbnail: data.thumbnail, // Giữ URL cũ
      colors: [] as { name: string; code: string; images: string[] }[]
    }

    // Xử lý thumbnail: chỉ thêm placeholder nếu có file mới
    if (thumbnailFile) {
      filesToUpload.push(thumbnailFile)
      productDataPayload.thumbnail = '__THUMBNAIL_PLACEHOLDER__'
    }

    // Xử lý ảnh theo màu: phân biệt ảnh cũ (string) và ảnh mới (File)
    data.colors.forEach(color => {
      const colorPayload = { name: color.name, code: color.code, images: [] as string[] }
      if (color.images && Array.isArray(color.images)) {
        color.images.forEach(image => {
          if (image instanceof File) {
            filesToUpload.push(image)
            colorPayload.images.push('__IMAGE_PLACEHOLDER__')
          } else if (typeof image === 'string') {
            // Giữ URL ảnh cũ
            colorPayload.images.push(image)
          }
        })
      }
      productDataPayload.colors.push(colorPayload)
    })

    // Gắn files và data vào FormData
    filesToUpload.forEach(file => formData.append('files', file))
    formData.append('productData', JSON.stringify(productDataPayload))

    const response = await fetchEditProductAPI(id, formData)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate(`/admin/products/detail/${id}`)
      }, 2000)
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    event.preventDefault()
    inputRef.current?.click()
  }

  return {
    isLoading,
    allProductCategories,
    uploadImageInputRef,
    colorFileInputRefs,
    handleSubmit: handleSubmitForm(onSubmit),
    role,
    handleRemoveColor,
    handleRemoveSize,
    thumbnailPreview,
    handleThumbnailChange,
    handleAddImagesToColor,
    handleRemoveImageFromColor,
    handleClick,
    showPopupSize,
    showPopupColor,
    availableSizes,
    availableColors,
    handleOpenPopupColor,
    handleClosePopupColor,
    handleToggleColor,
    handleSelectAllColors,
    handleDeselectAllColors,
    handleConfirmSelectionColors,
    tempSelectedColors,
    handleOpenPopupSize,
    handleClosePopupSize,
    handleToggleSize,
    handleSelectAllSizes,
    handleDeselectAllSizes,
    handleConfirmSelectionSizes,
    tempSelectedSizes,
    // React Hook Form props
    register,
    errors,
    isSubmitting,
    setValue,
    watch,
    colors: watchedColors,
    sizes: watchedSizes
  }
}