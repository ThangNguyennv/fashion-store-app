/* eslint-disable indent */
import type { ArticleActions, ArticleStates } from '~/interfaces/article.interface'

export const initialState: ArticleStates = {
  articles: [],
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
  allArticles: []
}

export function articleReducer(
  stateArticle: ArticleStates,
  actionArticle: ArticleActions
): ArticleStates {
  switch (actionArticle.type) {
    case 'SET_LOADING':
      return { ...stateArticle, loading: actionArticle.payload }
    case 'SET_DATA':
      return { ...stateArticle, ...actionArticle.payload }
    default:
      return stateArticle
  }
}