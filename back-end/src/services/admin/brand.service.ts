import { Request, Response } from 'express'
import Brand from '~/models/brand.model'
import paginationHelpers from '~/helpers/pagination'
import searchHelpers from '~/helpers/search'

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

export const createBrand = async (data: any, account_id: string) => {
    data.createdBy = {
      account_id: account_id
    }

    const brand = new Brand(data)
    await brand.save()
    return brand
}

export const detailBrand = async (id: string) => {
    const brand = await Brand.findById(id)
    return brand
}

export const editBrand = async (data: any, id: string, account_id: string) => {
    delete data.updatedBy
    const updatedBy = {
      account_id: account_id,
      updatedAt: new Date()
    }

    return  await Brand.updateOne(
      { _id: id },
      { 
        ...data,
        $push: { updatedBy: updatedBy }
      }
    )
}

export const deleteBrand = async (id: string, account_id: string) => {
    const deletedBy = {
      account_id: account_id,
      deletedAt: new Date()
    }
    return await Brand.updateOne(
      { _id: id },
      { deleted: true, deletedBy: deletedBy }
    )
}