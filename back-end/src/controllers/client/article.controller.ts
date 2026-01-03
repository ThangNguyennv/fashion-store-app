import { Request, Response } from 'express'
import Article from '~/models/article.model'
import ArticleCategory from '~/models/article-category.model'
import paginationHelpers from '~/helpers/pagination'

// [GET] /articles
export const index = async (req: Request, res: Response) => {
  try {
    interface Find {
      deleted: boolean
      status?: string
      title?: RegExp
    }
    const find: Find = { deleted: false }

    // Pagination
      const countProducts = await Article.countDocuments(find)
      const objectPagination = paginationHelpers(
        { currentPage: 1, limitItems: 20 },
        req.query,
        countProducts
      )
    // End Pagination

    const [articles, allArticles] = await Promise.all([
      Article
        .find(find)
        .sort({ createdAt: -1 })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)
        .lean(),
      Article
        .find(find)
        .sort({ createdAt: -1 })
        .lean()
    ])

    res.json({
      code: 200,
      message: 'Thành công!',
      articles: articles,
      pagination: objectPagination,
      allArticles: allArticles
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /articles/:slugCategory
export const category = async (req: Request, res: Response) => {
  try {
    const category = await ArticleCategory.findOne({
      slug: req.params.slugCategory,
      status: 'ACTIVE',
      deleted: false
    })
    const getSubArticle = async (parentId) => {
      const subs = await ArticleCategory.find({
        deleted: false,
        status: 'ACTIVE',
        parent_id: parentId
      })
      let allSub = [...subs] // Cú pháp trải ra (spread syntax)

      for (const sub of subs) {
        const childs = await getSubArticle(sub.id) // Gọi đệ quy để lấy tất cả các danh mục con
        allSub = allSub.concat(childs) // Nối mảng con vào mảng cha
      }
      return allSub
    }
    const listSubCategory = await getSubArticle(category.id)
    const listSubCategoryId = listSubCategory.map((item) => item.id)

    const articles = await Article
      .find({
        deleted: false,
        article_category_id: { $in: [category.id, ...listSubCategoryId] }
      })
      .sort({ createdAt: -1 })
      .lean()
  
    res.json({
      code: 200,
      message: 'Thành công!',
      articles: articles,
      pageTitle: category.title
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /articles/detail/:slugArticle
export const detail = async (req: Request, res: Response) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugArticle,
      status: 'ACTIVE'
    }
    const article = await Article.findOne(find)
    if (article.article_category_id) {
      const category = await ArticleCategory.findOne({
        _id: article.article_category_id,
        deleted: false,
        status: 'ACTIVE'
      })
      article['category'] = category
    }
    res.json({
      code: 200,
      message: 'Thành công!',
      article: article
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
