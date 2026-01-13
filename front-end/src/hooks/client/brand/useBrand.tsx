
/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import { fetchClientBrandsAPI } from '~/apis/client/brand.api'
import type { BrandGroup } from '~/interfaces/brand.interface'

const useBrand = () => {
  const [brandGroups, setBrandGroups] = useState<BrandGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetchClientBrandsAPI()
        if (res.code === 200) {
          setBrandGroups(res.brands)
        }
      } catch (error) {
        console.error('Lỗi khi fetch thương hiệu:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  return {
    brandGroups,
    loading
  }
}

export default useBrand