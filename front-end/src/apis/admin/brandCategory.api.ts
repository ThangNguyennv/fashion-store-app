/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ROOT } from '~/utils/constants'
// Giả sử bạn sẽ tạo brand.type.ts, tương tự như product.type.ts
import type { BrandCategory } from '~/types/brand.type'
import authorizedAxiosInstance from '~/utils/authorizedAxiosAdmin'

interface ApiResponse {
  code: number
  message: string
  [key: string]: any
}

// API lấy tất cả danh mục thương hiệu
export const fetchAllBrandCategoriesAPI = async (): Promise<ApiResponse & { categories: BrandCategory[] }> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/brands-category`
  )
  return response.data
}

// API tạo mới
export const createBrandCategoryAPI = async (data: Omit<BrandCategory, '_id'>): Promise<ApiResponse & { data: BrandCategory }> => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/admin/brands-category/create`,
    data
  )
  return response.data
}

// API lấy chi tiết
export const fetchBrandCategoryDetailAPI = async (id: string): Promise<ApiResponse & { category: BrandCategory }> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/brands-category/detail/${id}`
  )
  return response.data
}

// API cập nhật
export const updateBrandCategoryAPI = async (id: string, data: Partial<BrandCategory>): Promise<ApiResponse> => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/brands-category/edit/${id}`,
    data
  )
  return response.data
}

// API xóa
export const deleteBrandCategoryAPI = async (id: string): Promise<ApiResponse> => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/admin/brands-category/delete/${id}`
  )
  return response.data
}
