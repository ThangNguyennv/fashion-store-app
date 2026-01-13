/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchBrandDetailAPI, updateBrandAPI } from '~/apis/admin/brand.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { Brand } from '~/interfaces/brand.interface'

const useEdit = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchBrandDetailAPI(id)
      .then(res => {
        setBrand(res.brand)
        setPreview(res.brand.thumbnail) // Set preview ban đầu là ảnh cũ
      })
      .catch(() => dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Không tìm thấy thương hiệu', severity: 'error' } }))
      .finally(() => setLoading(false))
  }, [id, dispatchAlert])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile)) // Cập nhật preview thành ảnh mới
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string, value: string }
    setBrand(prev => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !brand) return

    const formData = new FormData()
    formData.append('title', brand.title)
    formData.append('status', brand.status)
    if (brand.brand_category_id) formData.append('brand_category_id', brand.brand_category_id)
    if (file) {
      formData.append('thumbnail', file) // Gửi file mới
    }
    // Nếu không có file mới, backend sẽ giữ nguyên thumbnail cũ (theo logic controller)

    try {
      const res = await updateBrandAPI(id, formData)
      if (res.code === 200) {
        dispatchAlert({ type: 'SHOW_ALERT', payload: { message: res.message, severity: 'success' } })
        navigate('/admin/brands')
      }
    } catch (error) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Cập nhật thất bại', severity: 'error' } })
    }
  }
  return {
    loading,
    preview,
    handleFileChange,
    handleChange,
    handleSubmit,
    brand,
    navigate
  }
}

export default useEdit