import Brand from '~/models/brand.model'
import paginationHelpers from '~/helpers/pagination'
import searchHelpers from '~/helpers/search'
import { BrandInterface } from '~/interfaces/admin/brand.interface'

export const getBrands = async (query: any) => {
    const find: any = { deleted: false }
    
    // Search
    const objectSearch = searchHelpers(query)
    if (objectSearch.regex) {
      find.title = objectSearch.regex
    }
    // End search

    // Pagination
    const countBrands = await Brand.countDocuments(find)
    const objectPagination = paginationHelpers(
      { currentPage: 1, limitItems: 10 },
      query,
      countBrands
    )
    // End Pagination

    const brands = await Brand
      .find(find)
      .sort({ createdAt: -1 })
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)
    return {
        brands,
        objectPagination
    }
}

export const createBrand = async (data: BrandInterface, account_id: string) => {
    const dataTemp = {
        title: data.title,
        status: data.status,
        thumbnail: data.thumbnail,
        createdBy: {
            account_id
        }
    }

    const brand = new Brand(dataTemp)
    await brand.save()
    const brandToObject = brand.toObject()
    return brandToObject
}

export const detailBrand = async (brand_id: string) => {
    const brand = await Brand.findById(brand_id)
    return brand
}

export const editBrand = async (data: BrandInterface, brand_id: string, account_id: string) => {
    const updatedBy = {
      account_id: account_id,
      updatedAt: new Date()
    }
    const dataTemp = {
        title: data.title,
        status: data.status,
        thumbnail: data.thumbnail,
        createdBy: account_id
    }
    await Brand.updateOne(
      { _id: brand_id },
      { 
        $set: dataTemp,
        $push: { updatedBy }
      }
    )
}

export const deleteBrand = async (brand_id: string, account_id: string) => {
    const deletedBy = {
      account_id: account_id,
      deletedAt: new Date()
    }
    await Brand.updateOne(
      { _id: brand_id },
      { $set: { deleted: true, deletedBy }}
    )
}