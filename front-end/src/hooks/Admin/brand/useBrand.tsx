/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { deleteBrandAPI, fetchBrandAPI } from '~/apis/admin/brand.api'
import type { Brand } from '~/types/brand.type'
import { useAlertContext } from '~/contexts/alert/AlertContext'

const useBrand = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { dispatchAlert } = useAlertContext()
  const [searchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1', 10)

  const loadBrands = async (currentPage = 1) => {
    setLoading(true)
    try {
      const res = await fetchBrandAPI(currentPage)
      if (res.code === 200) {
        setBrands(res.brands)
        setPagination(res.pagination)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBrands(page)
  }, [page])

  const handleDelete = async () => {
    if (!selectedId) return
    try {
      const res = await deleteBrandAPI(selectedId)
      if (res.code === 200) {
        dispatchAlert({ type: 'SHOW_ALERT', payload: { message: res.message, severity: 'success' } })
        loadBrands(page)
      }
    } catch (error) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Xóa thất bại', severity: 'error' } })
    } finally {
      setOpenDeleteDialog(false)
      setSelectedId(null)
    }
  }

  const handleOpenDelete = (id: string) => {
    setSelectedId(id)
    setOpenDeleteDialog(true)
  }

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false)
    setSelectedId(null)
  }
  return {
    brands,
    loading,
    openDeleteDialog,
    Link,
    handleDelete,
    handleOpenDelete,
    handleCloseDelete
  }
}

export default useBrand