import Product from '~/models/product.model'
import searchHelpers from '~/helpers/search'
import paginationHelpers from '~/helpers/pagination'

export const getProducts = async (query: any) => {
  const find: any = { deleted: false }

  if (query.status) {
    find.status = query.status.toString()
  }

  // Search
  const objectSearch = searchHelpers(query)
  if (objectSearch.regex || objectSearch.slug) {
    find.$or = [
      { title: objectSearch.regex },
      { slug: objectSearch.slug }
    ]
  }
  // End search

  // Sort
  let sort: Record<string, 1 | -1> = { }
  if (query.sortKey) {
    const key = query.sortKey.toString()
    const dir = query.sortValue === 'asc' ? 1 : -1
    sort[key] = dir
  }
  // luôn sort phụ theo createdAt
  if (!sort.createdAt) {
    sort.createdAt = -1
  }
  // End Sort

  // Pagination
  const countProducts = await Product.countDocuments(find)
  const objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 5
    },
    query,
    countProducts
  )
  // End Pagination
  
  const [products, allProducts] = await Promise.all([
    Product
      .find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)
      .populate('createdBy.account_id', 'fullName email')
      .populate('updatedBy.account_id', 'fullName email')
      .lean(),
    Product
      .find({ deleted: false })
      .lean()
  ])
  return {
    products,
    allProducts,
    objectSearch,
    objectPagination
  }
}

export const changeStatusProduct = async (id: string, status: string, account_id: string) => {
  const updatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }

  const updater = await Product
    .findByIdAndUpdate(
      { _id: id },
      {
        status: status,
        $push: { updatedBy: updatedBy }
      },
      { new: true } // Trả về document sau update
    )
    .populate('updatedBy.account_id', 'fullName email')
    .lean() 
  return updater
}

export const deleteProduct = async (id: string, account_id: string) => {
  return Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: account_id,
        deletedAt: new Date()
      }
    }
  )
}

export const createProduct = async (data: any, account_id: string, fileUrls: any) => {
  // 1. Parse dữ liệu sản phẩm từ chuỗi JSON
  const productData = data

  // 2. Lấy mảng URL đã được upload từ middleware
  const uploadedUrls = fileUrls || []
  let urlIndex = 0

  // 3. Xử lý ảnh đại diện (thumbnail)
  if (productData.thumbnail === '__THUMBNAIL_PLACEHOLDER__') {
    productData.thumbnail = uploadedUrls[urlIndex]
    urlIndex++
  }
  
  // 4. Lắp ráp URL vào đúng vị trí trong mảng colors
  for (const color of productData.colors) {
    const imageCount = color.images.length // Số lượng ảnh cần cho màu này
    if (imageCount > 0) {
      // Lấy đúng số lượng URL từ mảng đã upload
      const colorImages = uploadedUrls.slice(urlIndex, urlIndex + imageCount)
      color.images = colorImages
      urlIndex += imageCount
    }
  }

  productData.price = parseInt(productData.price) || 0
  productData.discountPercentage = parseInt(productData.discountPercentage) || 0
  productData.stock = parseInt(productData.stock) || 0
  
  // let position: number
  // if (!productData.position) {
  //   const count = await Product.countDocuments({ deleted: false })
  //   position = count + 1
  // } else {
  //   position = parseInt(productData.position)
  // }
  // productData.position = position
  productData.createdBy = {
    account_id: account_id
  }

  const records = new Product(productData)
  await records.save()
  return records
}

export const editProduct = async (data: any, account_id: string, id: string, fileUrls: any) => {
  // 1. Parse dữ liệu sản phẩm từ chuỗi JSON
  const productData = data

  // 2. Lấy mảng URL của các ảnh MỚI đã được upload
  const uploadedUrls = fileUrls || []
  let urlIndex = 0

  // 3. Xử lý ảnh đại diện (thumbnail)
  if (productData.thumbnail === '__THUMBNAIL_PLACEHOLDER__') {
    productData.thumbnail = uploadedUrls[urlIndex]
    urlIndex++
  }

  // 4. Lắp ráp lại mảng ảnh cho từng màu
  for (const color of productData.colors) {
    // Thay thế các placeholder bằng URL mới
    color.images = color.images.map((image: string) => {
      if (image === '__IMAGE_PLACEHOLDER__') {
        const newUrl = uploadedUrls[urlIndex]
        urlIndex++
        return newUrl
      }
      // Giữ nguyên các URL ảnh cũ
      return image
    })
  }

  // Logic parseInt không đổi
  productData.price = parseInt(productData.price) || 0
  productData.discountPercentage = parseInt(productData.discountPercentage) || 0
  productData.stock = parseInt(productData.stock) || 0
  // productData.position = parseInt(productData.position) || 0

  const updatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }
  delete productData.updatedBy

  return Product.updateOne(
    { _id: id },
    {
      ...productData, // Dùng productData đã được lắp ráp hoàn chỉnh
      $push: { updatedBy: updatedBy }
    }
  )
}

export const detaiProduct = async (id: string) => {
  const find = {
    deleted: false,
    _id: id
  }
  const product = await Product.findOne(find)
  return product
}

export const productTrash = async (query: any) => {
  const find: any = {
    deleted: true
  }

  // Search
  const objectSearch = searchHelpers(query)
  if (objectSearch.regex || objectSearch.slug) {
    find.$or = [
      { title: objectSearch.regex },
      { slug: objectSearch.slug }
    ]
  }
  // End search

  // Sort
  let sort: Record<string, 1 | -1> = { }
  if (query.sortKey) {
    const key = query.sortKey.toString()
    const dir = query.sortValue === 'asc' ? 1 : -1
    sort[key] = dir
  }
  // luôn sort phụ theo createdAt
  if (!sort.createdAt) {
    sort.createdAt = -1
  }
  // End Sort


  // Pagination
  const countOrders = await Product.countDocuments(find)

  const objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 10
    },
    query,
    countOrders
  )
  // End Pagination

  const products = await Product
    .find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    .lean()
    .populate('createdBy.account_id', 'fullName email')
    .populate('deletedBy.account_id', 'fullName email') // Lấy thông tin người tạo
    .lean()
  return {
    products,
    objectSearch,
    objectPagination
  }
}

export const permanentlyDeleteProduct = async (id: string) => {
  return Product.deleteOne(
    { _id: id }
  )
}

export const recoverProduct = async (id: string) => {
  return Product.updateOne(
    { _id: id },
    { deleted: false, recoveredAt: new Date() }
  )
}