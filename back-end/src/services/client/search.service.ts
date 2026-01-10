import Product from '~/models/product.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import { convertToSlug } from '~/helpers/convertToSlug'

interface ObjectSearch {
  keyword: string
  regex?: RegExp
}

export const getSearch = async (keyword: any) => {
    const objectSearch: ObjectSearch = {
      keyword: ''
    }
    let newProducts = []
    if (keyword) {
      objectSearch.keyword = keyword as string | never
      const stringSlug = convertToSlug(String(keyword))
      const stringSlugRegex = new RegExp(stringSlug, 'i')
      const regex = new RegExp(objectSearch.keyword, 'i')
      const products = await Product.find({
        $or: [
          { title: regex },
          { slug: stringSlugRegex }
        ],
        deleted: false,
        status: 'ACTIVE'
      })
      newProducts = productsHelper.priceNewProducts(products as OneProduct[])
    }
    return {
        objectSearch,
        newProducts
    }
}