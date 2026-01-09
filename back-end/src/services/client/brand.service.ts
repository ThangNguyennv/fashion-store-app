import Brand from '~/models/brand.model'

export const getAllBrands = async () => {
    const find: any = { deleted: false }
 
    const brands = await Brand
      .find(find)
      .sort({ createdAt: -1 })
      .lean()

    return brands
}