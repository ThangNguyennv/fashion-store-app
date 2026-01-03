/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ROOT } from '~/utils/constants'
import type { BranchApiResponse, Brand } from '~/types/brand.type'
import authorizedAxiosInstance from '~/utils/authorizedAxiosAdmin'

export const fetchBrandAPI = async (page = 1, keyword = ''): Promise<BranchApiResponse & { brands: Brand[], pagination: any }> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/brands?page=${page}&keyword=${keyword}`
  )
  return response.data
}

export const createBrandAPI = async (formData: FormData): Promise<BranchApiResponse & { data: Brand }> => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/admin/brands/create`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    }
  )
  return response.data
}

export const fetchBrandDetailAPI = async (id: string): Promise<BranchApiResponse & { brand: Brand }> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/brands/detail/${id}`
  )
  return response.data
}

export const updateBrandAPI = async (id: string, formData: FormData): Promise<BranchApiResponse> => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/brands/edit/${id}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    }
  )
  return response.data
}

export const deleteBrandAPI = async (id: string): Promise<BranchApiResponse> => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/admin/brands/delete/${id}`
  )
  return response.data
}
