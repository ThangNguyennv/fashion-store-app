import Article from '~/models/article.model'
import searchHelpers from '~/helpers/search'
import paginationHelpers from '~/helpers/pagination'
import { ArticleInterface } from '~/interfaces/admin/article.interface'

export const getArticles = async (query: any) => {
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
  const countArticles = await Article.countDocuments(find)
  const objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 5
    },
    query,
    countArticles
  )
  // End Pagination

  const [articles, allArticles] = await Promise.all([
    Article
      .find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)
      .populate('createdBy.account_id', 'fullName email')
      .populate('updatedBy.account_id', 'fullName email')
      .lean(),
    Article
      .find({ deleted: false })
      .lean()
  ])

  return {
    articles,
    objectSearch,
    objectPagination,
    allArticles
  }
}

export const createArticle = async (data: ArticleInterface, account_id: string) => {
  const dataTemp = {
    title: data.title,
    article_category_id: data.article_category_id,
    featured: data.featured,
    descriptionShort: data.descriptionShort,
    descriptionDetail: data.descriptionDetail,
    status: data.status,
    thumbnail: data.thumbnail,
    createdBy: {
      account_id
    }
  }

  const article = new Article(dataTemp)
  await article.save()
  const articleToObject = article.toObject()

  return articleToObject
}

export const detailArticle = async (article_id: string) => {
  const article = await Article
    .findOne({ _id: article_id, deleted: false })
    .lean()
    
  return article
}

export const editArticle = async (data: ArticleInterface, article_id: string, account_id: string) => {
  const updatedBy = {
    account_id,
    updatedAt: new Date()
  }
  const dataTemp = {
    title: data.title,
    article_category_id: data.article_category_id,
    featured: data.featured,
    descriptionShort: data.descriptionShort,
    descriptionDetail: data.descriptionDetail,
    status: data.status,
    thumbnail: data.thumbnail,
  }
  await Article.updateOne(
    { _id: article_id },
    { 
      $set: dataTemp,
      $push: { updatedBy }
    }
  )
}

export const changeStatusArticle = async (status: string, article_id: string, account_id: string) => {
  const updatedBy = {
    account_id,
    updatedAt: new Date()
  }
  const updater = await Article
    .findByIdAndUpdate(
      { _id: article_id },
      {
        $set: { status },
        $push: { updatedBy }
      },
      { new: true } // Trả về document sau update
    )
    .populate('createdBy.account_id', 'fullName email')
    .populate('updatedBy.account_id', 'fullName email')
    .lean() 

  return updater
}

export const deleteArticle = async (article_id: string, account_id: string) => {
  await Article.updateOne(
    { _id: article_id },
    {
      $set: {
        deleted: true,
        deletedBy: {
          account_id,
          deletedAt: new Date()
        }
      }
    }
  )
}