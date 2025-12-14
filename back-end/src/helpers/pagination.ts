interface ObjectPagination {
  currentPage: number;
  limitItems: number;
  skip?: number;
  totalPage?: number;
  totalItems?: number
}

const paginationHelpers = (
  objectPagination: ObjectPagination,
  query: Record<string, unknown>,
  countProducts: number
): ObjectPagination => {
  if (query.page) {
    if (typeof query.page === 'string') {
      objectPagination.currentPage = parseInt(query.page)
    }
  }
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems
  const totalPage = Math.ceil(countProducts / objectPagination.limitItems)

  objectPagination.totalPage = totalPage
  objectPagination.totalItems = countProducts
  return objectPagination
}

export default paginationHelpers
