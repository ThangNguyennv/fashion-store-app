import type { GeneralInfoInterface, HelperInterface } from './helper.type'

export interface ArticleInfoInterface extends GeneralInfoInterface {
  article_category_id: string,
  featured: '1' | '0',
  descriptionShort: string,
  descriptionDetail: string,
  accountFullName: string,
}

export interface ArticleAPIResponse extends HelperInterface {
  articles: ArticleInfoInterface[],
  allArticles: ArticleInfoInterface[],
  code: number,
  message: string,
  keyword: string
}

export interface ArticleStates extends HelperInterface {
  articles: ArticleInfoInterface[],
  allArticles: ArticleInfoInterface[],
  keyword: string,
  sortKey: string,
  sortValue: string,
  loading: boolean,
}

export type ArticleActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<ArticleStates> }

export interface ArticleDetailInterface {
  article: ArticleInfoInterface
}

export interface ArticlesWithCategoryDetailInterface {
  articles: ArticleInfoInterface[],
  pageTitle: string
}

export interface ArticleForm {
  title: string
  status: string
  descriptionShort: string
  descriptionDetail: string
  featured: string
  thumbnail: string
  slug: string
  article_category_id: string
}