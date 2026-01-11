
import { useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCreateProductAPI } from '~/apis/admin/product.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { availableColors, availableSizes } from '~/utils/constants'
import { productSchema, type ProductFormData } from '~/validations/admin/product.validate'

export const useCreate = () => {
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

  // Ref cho thumbnail
  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  // Tạo một mảng ref để quản lý các input file của từng màu
  const colorFileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // State chỉ để lưu file và URL preview, không lưu trực tiếp vào productInfo
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit: handleSubmitForm,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    trigger
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      thumbnail: null,
      status: 'ACTIVE',
      price: 0,
      discountPercentage: 0,
      stock: 1,
      featured: '1',
      product_category_id: '',
      description: '',
      colors: [],
      sizes: []
    }
  })

  // Watch colors và sizes để validate
  const watchedColors = watch('colors')
  const watchedSizes = watch('sizes')

  // Hàm xử lý ảnh đại diện
  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
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

      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview) // Giải phóng bộ nhớ
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
      setValue('thumbnail', file)
      trigger('thumbnail') // Trigger validation
    }
  }

  // Phần xử lý màu sắc
  const handleOpenPopupColor = () => {
    setTempSelectedColors([...watchedColors])
    setShowPopupColor(true)
  }
  // Đóng popup mà không lưu
  const handleClosePopupColor = () => {
    setShowPopupColor(false)
    setTempSelectedColors([])
  }

  // Toggle chọn/bỏ chọn màu trong popup
  const handleToggleColor = (color: { code: string, name: string }) => {
    const isSelected = tempSelectedColors.some(c => c.code === color.code)

    if (isSelected) {
      // Bỏ chọn
      setTempSelectedColors(tempSelectedColors.filter(c => c.code !== color.code))
    } else {
      // Chọn
      setTempSelectedColors([...tempSelectedColors, { ...color, images: [] }])
    }
  }

  // Chọn tất cả màu
  const handleSelectAllColors = () => {
    const allColors = availableColors.map(color => ({ ...color, images: [] }))
    setTempSelectedColors(allColors)
  }

  // Bỏ chọn tất cả màu
  const handleDeselectAllColors = () => {
    setTempSelectedColors([])
  }

  // Lưu màu đã chọn khi ấn nút "Xong"
  const handleConfirmSelectionColors = () => {
    // Giữ lại images của các màu đã có trước đó
    const updatedColors = tempSelectedColors.map(tempColor => {
      const existingColor = watchedColors.find(c => c.code === tempColor.code)
      return existingColor ? existingColor : tempColor
    })

    setValue('colors', updatedColors)
    trigger('colors') // Trigger validation
    setShowPopupColor(false)
    setTempSelectedColors([])
  }

  // Hàm xử lý thêm ảnh cho một màu cụ thể
  const handleAddImagesToColor = (colorIndex: number, event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files)
      // Validate each file
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
      // Lưu trữ File object trực tiếp vào mảng images của màu đó
      const updatedImages = (newColors[colorIndex].images || []).concat(newFiles)
      newColors[colorIndex] = { ...newColors[colorIndex], images: updatedImages }
      setValue('colors', newColors)
    }
  }

  // Hàm xóa một ảnh khỏi gallery của một màu
  const handleRemoveImageFromColor = (colorIndex: number, imageIndex: number) => {
    const newColors = [...watchedColors]
    const imageToRemove = newColors[colorIndex].images[imageIndex]
    if (imageToRemove instanceof File) {
      URL.revokeObjectURL(URL.createObjectURL(imageToRemove))
    }
    const newImages = newColors[colorIndex].images.filter((_, idx) => idx !== imageIndex)
    newColors[colorIndex] = { ...newColors[colorIndex], images: newImages }
    setValue('colors', newColors)
  }

  // Xóa màu
  const handleRemoveColor = (indexToRemove: number) => {
    const newColors = watchedColors.filter((_, index) => index !== indexToRemove)
    setValue('colors', newColors)
    trigger('colors')
  }
  // Hết Phần xử lý màu sắc

  // Phần xử lý size
  const handleOpenPopupSize = () => {
    setTempSelectedSizes([...watchedSizes])
    setShowPopupSize(true)
  }
  // Đóng popup mà không lưu
  const handleClosePopupSize = () => {
    setShowPopupSize(false)
    setTempSelectedSizes([])
  }

  // Toggle chọn/bỏ chọn size trong popup
  const handleToggleSize = (size: string) => {
    const isSelected = tempSelectedSizes.some(s => s === size)

    if (isSelected) {
      // Bỏ chọn
      setTempSelectedSizes(tempSelectedSizes.filter(s => s !== size))
    } else {
      // Chọn
      setTempSelectedSizes([...tempSelectedSizes, size])
    }
  }

  // Chọn tất cả size
  const handleSelectAllSizes = () => {
    const allSizes = availableSizes.map(size => size)
    setTempSelectedSizes(allSizes)
  }

  // Bỏ chọn tất cả size
  const handleDeselectAllSizes = () => {
    setTempSelectedSizes([])
  }

  // Lưu màu đã chọn khi ấn nút "Xong"
  const handleConfirmSelectionSizes = () => {
    setValue('sizes', tempSelectedSizes)
    trigger('sizes') // Trigger validation
    setShowPopupSize(false)
    setTempSelectedSizes([])
  }

  const handleRemoveSize = (indexToRemove: number) => {
    const newSizes = watchedSizes.filter((_, index) => index !== indexToRemove)
    setValue('sizes', newSizes)
    trigger('sizes')
  }
  // Hết Phần xử lý size

  const onSubmit = async (data: ProductFormData): Promise<void> => {
    // Validate colors have images
    const hasColorWithoutImages = data.colors.some(color => !color.images || color.images.length === 0)
    if (hasColorWithoutImages) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Mỗi màu phải có ít nhất 1 ảnh', severity: 'error' }
      })
      return
    }
    const formData = new FormData()
    // 1. Chuẩn bị dữ liệu và tập hợp các file cần upload
    const filesToUpload: File[] = []

    // Tạo một bản sao sạch của productInfo để gửi đi, đảm bảo nhất quán
    const productDataPayload = {
      ...data,
      thumbnail: '', // Tạm thời xóa, sẽ được thay thế bằng placeholder
      colors: [] as { name: string; code: string; images: string[] }[]
    }
    // Xử lý ảnh đại diện
    if (thumbnailFile) {
      filesToUpload.push(thumbnailFile)
      // Dùng placeholder để backend biết vị trí của thumbnail trong mảng files
      productDataPayload.thumbnail = '__THUMBNAIL_PLACEHOLDER__'
    }

    // Xử lý ảnh theo từng màu
    data.colors.forEach(color => {
      const colorPayload = { name: color.name, code: color.code, images: [] as string[] }
      if (color.images && Array.isArray(color.images)) {
        (color.images).forEach(image => {
          if (image instanceof File) {
            filesToUpload.push(image)
            // Dùng placeholder để backend biết ảnh này thuộc về màu nào
            colorPayload.images.push('__IMAGE_PLACEHOLDER__')
          }
        })
      }
      productDataPayload.colors.push(colorPayload)
    })

    // 2. Gắn dữ liệu vào FormData
    // Gắn tất cả các file ảnh vào MỘT trường duy nhất là 'files'
    filesToUpload.forEach(file => {
      formData.append('files', file)
    })
    // Gắn tất cả các thông tin còn lại vào MỘT trường 'productData' dưới dạng JSON
    formData.append('productData', JSON.stringify(productDataPayload))

    const response = await fetchCreateProductAPI(formData)
    if (response.code === 201) {
      // setProductInfo(response.data)
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/admin/products')
      }, 2000)
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, inputRef: React.RefObject<HTMLInputElement | null>) => {
    event.preventDefault()
    inputRef.current?.click()
  }


  return {
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
    // Thêm các props từ react-hook-form
    register,
    errors,
    isSubmitting,
    setValue,
    watch,
    colors: watchedColors,
    sizes: watchedSizes
  }
}