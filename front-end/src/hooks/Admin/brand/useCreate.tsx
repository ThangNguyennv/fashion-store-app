/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBrandAPI } from '~/apis/admin/brand.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'

const useCreate = () => {
  const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('ACTIVE')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Vui lòng chọn logo', severity: 'error' } })
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('status', status)
    formData.append('thumbnail', file) // Backend nhận 'thumbnail'

    try {
      const res = await createBrandAPI(formData)
      if (res.code === 201) {
        dispatchAlert({ type: 'SHOW_ALERT', payload: { message: res.message, severity: 'success' } })
        navigate('/admin/brands')
      }
    } catch (error) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Tạo mới thất bại', severity: 'error' } })
    }
  }
  return {
    setTitle,
    setStatus,
    preview,
    handleFileChange,
    handleSubmit,
    title,
    navigate
  }
}

export default useCreate