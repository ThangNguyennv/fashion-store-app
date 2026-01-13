import Product from '~/models/product.model'
import ProductCategory from '~/models/productCategory.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import paginationHelpers from '~/helpers/pagination'
import searchHelpers from '~/helpers/search'

export const getSubCategory = async (parentId: string) => {
  const subs = await ProductCategory.find({
    deleted: false,
    status: 'ACTIVE',
    parent_id: parentId
  })
  let allSub = [...subs]

  for (const sub of subs) {
    const childs = await getSubCategory(sub.id)
    allSub = allSub.concat(childs)
  }
  return allSub
}

export const getProducts = async (query: any) => {
    const find: any = { deleted: false }
    
    // Search
    const objectSearch = searchHelpers(query)
    if (objectSearch.regex || objectSearch.slug) {
        find.$or = [
            { title: objectSearch.regex },
            { slug: objectSearch.slug }
        ]
    }
    // End search
    
    if (query.category) {
        const categorySlug = query.category.toString()
        const category = await ProductCategory.findOne({
            slug: categorySlug,
            status: 'ACTIVE',
            deleted: false
        })

        if (category) {
            // SỬ DỤNG HÀM ĐỆ QUY `getSubCategory`
            // Lấy tất cả ID của danh mục con (Cấp 2, 3, 4...)
            const listSubCategory = await getSubCategory(category.id)
            const listSubCategoryId = listSubCategory.map((item) => item.id)
            // Tìm sản phẩm có ID nằm trong danh mục cha (Cấp 1) HOẶC bất kỳ danh mục con nào
            find.product_category_id = { $in: [category.id, ...listSubCategoryId] }
        } else {
            return { 
                success: false, 
                code: 404, 
                message: 'Danh mục không tồn tại!', 
                products: [], 
                pagination: {} 
            }
        }
    }

    if (query.maxPrice) {
        find.price = { $lte: parseInt(query.maxPrice.toString()) }
    }

    if (query.color) {
        find['colors.name'] = query.color.toString()
    }

    if (query.size) {
        find.sizes = query.size.toString()
    }

    const currentPage = parseInt(query.page as string) || 1
    const limitItems = 18 // Số sản phẩm mỗi trang
    const skip = (currentPage - 1) * limitItems
    const sort = {}
    const sortKey = query.sortKey as string
    const sortValue = query.sortValue === 'asc' ? 1 : -1 // Chuyển 'asc'/'desc' thành 1/-1

    sort[sortKey] = sortValue

    // XÂY DỰNG AGGREGATION PIPELINE
    const pipeline: any[] = [
        // Lọc sản phẩm
        { $match: find },
        // Tạo trường 'discountedPrice' (giá khuyến mãi)
        {
            $addFields: {
                discountedPrice: {
                    $floor: { // Giống Math.floor
                        $multiply: [
                            '$price',
                            { $divide: [{ $subtract: [100, '$discountPercentage'] }, 100] }
                        ]
                    }
                }
            }
        }
    ]

    // CHẠY PIPELINE ĐỂ LẤY DỮ LIỆU VÀ TỔNG SỐ LƯỢNG
    // Dùng $facet để chạy 2 truy vấn con song song: 1. đếm, 2. lấy dữ liệu đã phân trang
    const aggregationResult = await Product.aggregate([
        ...pipeline,
        {
            $facet: {
                // Pipeline con 1: Lấy tổng số sản phẩm (sau khi lọc)
                count: [
                    { $count: 'total' }
                ],
                // Pipeline con 2: Sắp xếp, bỏ qua và giới hạn để lấy đúng trang
                data: [
                    { $sort: sort },
                    { $skip: skip },
                    { $limit: limitItems }
                ]
            }
        }
    ])

    const products = aggregationResult[0].data
    const countProducts = aggregationResult[0].count[0]?.total || 0

    const objectPagination = paginationHelpers(
        { currentPage, limitItems },
        query,
        countProducts
    )

    const newProducts = productsHelper.priceNewProducts(
        products as OneProduct[]
    )
    return {
        success: true,
        newProducts,
        objectPagination,
        objectSearch
    }
}

export const getFilters = async () => {
    // Chạy 2 tác vụ lấy dữ liệu song song, thay vì nối tiếp
    const [categories, productAggregations] = await Promise.all([
        // Tác vụ 1: Lấy danh mục Cấp 1
        ProductCategory
            .find({
                deleted: false, status: 'ACTIVE',
                $or: [{ parent_id: null }, { parent_id: '' }] // Chỉ lấy danh mục gốc
            })
            .select('title slug _id')
            .sort({ title: 1 })
            .lean(),

        // Tác vụ 2: Chạy aggregation trên sản phẩm
        Product.aggregate([
        { $match: { deleted: false, status: 'ACTIVE' } },
        // Dùng $facet để chạy 3 pipeline con song song mà không làm bùng nổ dữ liệu
        {
            $facet: {
                // Pipeline con 1: Lấy tất cả màu sắc
                'allColors': [
                    { $unwind: '$colors' },
                    // Nhóm theo mã màu để đảm bảo tính duy nhất, Lấy giá trị đầu tiên trong nhóm
                    { $group: { _id: '$colors.code', name: { $first: '$colors.name' } } },
                    // Loại bỏ _id, giữ name, Đổi _id gán vào code
                    { $project: { _id: 0, name: '$name', code: '$_id' } },
                    { $sort: { name: 1 } } // Sắp xếp theo tên
                ],
                // Pipeline con 2: Lấy tất cả kích cỡ
                'allSizes': [
                    { $unwind: '$sizes' },
                    { $match: { sizes: { $nin: ['', null] } } }, 
                    { $group: { _id: '$sizes' } },
                    { $sort: { _id: 1 } }, // Sắp xếp A-Z
                    // Loại bỏ _id, Đổi _id gán vào name
                    { $project: { _id: 0, name: '$_id' } }
                ],
                // Pipeline con 3: Lấy giá cao nhất
                'maxPrice': [
                    { $group: { _id: null, max: { $max: '$price' } } }
                ]
            }
        }
        ])
    ])
    return {
        categories,
        productAggregations
    }
}

export const category = async (slugCategory: string) => {
    const category = await ProductCategory.findOne({
        slug: slugCategory,
        status: 'ACTIVE',
        deleted: false
    })

    const listSubCategory = await getSubCategory(category.id)

    const listSubCategoryId = listSubCategory.map((item) => item.id)

    const products = await Product
        .find({
            deleted: false,
            product_category_id: { $in: [category.id, ...listSubCategoryId] }
        })
        .sort({ createdAt: -1 })

    const newProducts = productsHelper.priceNewProducts(
        products as OneProduct[]
    )
    return {
        newProducts,
        category
    }
}

export const detail = async (slugProduct: string) => {
    const find = {
      deleted: false,
      slug: slugProduct,
      status: 'ACTIVE'
    }
    const product = await Product
      .findOne(find)
      .populate('comments.user_id')
      .lean()

    if (product.comments && product.comments.length > 0) {
        product.comments.sort((a: any, b: any) => {
            // Sắp xếp giảm dần (descending) theo thời gian
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
    }
    if (product.product_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        deleted: false,
        status: 'ACTIVE'
      })
      product['category'] = category
    }
    product['priceNew'] = productsHelper.priceNewProduct(product as OneProduct)
    return product
}

export const getSearchSuggestions = async (query: any) => {
    const find: any = { deleted: false, status: 'ACTIVE' }
    if (!query.keyword || !query.keyword.trim()) {
        return { 
            success: false, 
            code: 404, 
            message: 'Không tồn tại keyword!', 
            products: [] 
        }
    }
    const objectSearch = searchHelpers(query)
    if (objectSearch.regex || objectSearch.slug) {
      find.$or = [
        { title: objectSearch.regex },
        { slug: objectSearch.slug }
      ]
    }
    const products = await Product
      .find(find)
      .select('title thumbnail price discountPercentage slug')
      .limit(10)

    const newProducts = productsHelper.priceNewProducts(
      products as OneProduct[]
    )
    return {
        success: true,
        newProducts
    }
}

export const getRelatedProducts = async (productId: string) => {
    // 1. Tìm sản phẩm hiện tại để lấy category_id
    const currentProduct = await Product.findById(productId)

      // Nếu không tìm thấy sản phẩm hoặc sản phẩm không có danh mục, trả về mảng rỗng
    if (!currentProduct || !currentProduct.product_category_id) {
        return { 
            success: false, 
            code: 404, 
            message: 'Không tồn tại product_category_id!', 
            products: [] 
        }
    }

    // 2. Tìm các sản phẩm khác có cùng category_id
    const relatedProducts = await Product.find({
      product_category_id: currentProduct.product_category_id,
      _id: { $ne: productId } // $ne: loại trừ chính sản phẩm đang xem
    }).limit(8) // Giới hạn 8 sản phẩm liên quan

    // 3. Tính toán lại giá mới cho các sản phẩm
    const newProducts = productsHelper.priceNewProducts(
      relatedProducts as OneProduct[]
    )
    return {
        success: true,
        newProducts
    } 
}

export const createReview = async (data: any, productId: string, fileUrls: any, account_id: string) => {
    const userId = account_id // Lấy từ middleware xác thực
    const { rating, content, color, size } = data
    const images = fileUrls || [] // Lấy URL ảnh từ middleware uploadCloud

    const product = await Product.findById(productId)
    if (!product) {
        return { 
            success: false, 
            code: 404, 
            message: 'Không tìm thấy sản phẩm!' 
        }
    }

    const newReview = {
        user_id: userId,
        rating: Number(rating),
        content: content,
        images: images,
        color: color,
        size: size,
        status: 'APPROVED', // Hoặc 'pending' nếu bạn muốn duyệt
    }

    // Thêm đánh giá mới vào sản phẩm
    product.comments.push(newReview)

    // Tính toán lại điểm sao trung bình
    let totalRating = 0
    const approvedComments = product.comments.filter(c => c.status === 'APPROVED')
    
    approvedComments.forEach(comment => {
        totalRating += comment.rating
    })

    product.stars.count = approvedComments.length
    product.stars.average = approvedComments.length > 0 ? totalRating / approvedComments.length : 0

    await product.save()
    return {
        success: true
    }
}

export const getTopRatedReviews = async () => {
    const topReviews = await Product.aggregate([
    // 1. Chỉ lấy sản phẩm có bình luận
    { $match: { 'comments.0': { $exists: true } } },
    // 2. Tách mảng comments thành các document riêng lẻ
    { $unwind: '$comments' },
    // 3. Lọc lấy comment 5 sao và đã được duyệt
    {
      $match: {
      'comments.rating': 5,
      'comments.status': 'APPROVED'
      }
    },
    // 4. Sắp xếp (ví dụ: mới nhất)
    { $sort: { 'comments.createdAt': -1 } },
    // 5. Giới hạn số lượng
    { $limit: 10 },
    // 6. Thay thế "root" (sản phẩm) bằng (comment)
    { $replaceRoot: { newRoot: '$comments' } },
    // 7. Lấy thông tin người dùng (tên)
    {
      $lookup: {
        from: 'users', // Tên collection của User model
        localField: 'user_id',
        foreignField: '_id',
        as: 'commentUser'
      }
    },
    // 8. Định dạng lại output
    {
    $project: {
        _id: 0,
        name: { $arrayElemAt: ['$commentUser.fullName', 0] },
        quote: '$content',
        rating: '$rating',
        verified: { $literal: true } // Mặc định là đã xác minh (vì đã mua)
      }
    }
   ])

   // Xử lý trường hợp không tìm thấy tên
   const formattedReviews = topReviews.map((review) => ({
      ...review,
      name: review.name || 'Người dùng ẩn danh'
   }))
   return formattedReviews
}