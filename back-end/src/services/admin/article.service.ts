import Article from '~/models/article.model'
import searchHelpers from '~/helpers/search'
import paginationHelpers from '~/helpers/pagination'

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

export const createArticle = async (data: any, account_id: string) => {
  data.createdBy = {
    account_id: account_id
  }
  const article = new Article(data)
  await article.save()
  return article
}

export const detailArticle = async (id: string) => {
  const find = {
    deleted: false,
    _id: id
  }

  const article = await Article.findOne(find)
  return article
}

export const editArticle = async (data: any, id: string, account_id: string) => {
  const updatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }
  return Article.updateOne(
    { _id: id },
    {
      ...data,
      $push: {
        updatedBy: updatedBy
      }
    }
  )
}

export const changeStatusArticle = async (status: string, id: string, account_id: string) => {
  const updatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }
  const updater = await Article
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

export const deleteArticle = async (id: string, account_id: string) => {
  return Article.updateOne(
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