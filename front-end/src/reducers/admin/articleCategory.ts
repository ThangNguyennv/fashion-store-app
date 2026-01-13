/* eslint-disable indent */

import type { ArticleCategoryActions, ArticleCategoryStates } from '~/interfaces/articleCategory.interface'

export const initialState: ArticleCategoryStates = {
  articleCategories: [],
  accounts: [],
  filterStatus: [],
  pagination: {
    currentPage: 1,
    limitItems: 3,
    skip: 0,
    totalPage: 0,
    totalItems: 0
  },
  keyword: '',
  sortKey: '',
  sortValue: '',
  loading: false,
  allArticleCategories: [],
  date: ''
}

export function articleCategoryReducer(
  stateArticleCategory: ArticleCategoryStates,
  actionArticleCategory: ArticleCategoryActions
): ArticleCategoryStates {
  switch (actionArticleCategory.type) {
    case 'SET_LOADING':
      return { ...stateArticleCategory, loading: actionArticleCategory.payload }
    case 'SET_DATA':
      return { ...stateArticleCategory, ...actionArticleCategory.payload }
    case 'RESET':
      return initialState
    default:
      return stateArticleCategory
  }
}