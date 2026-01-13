import type { ArticleInfoInterface } from './article.interface'
import type { GeneralInfoInterface, HelperInterface } from './helper.interface'

export interface ArticleCategoryInfoInterface extends GeneralInfoInterface {
  children: ArticleCategoryInfoInterface[] | [],
  parent_id: string,
  descriptionShort: string,
  descriptionDetail: string
}

export interface ArticleCategoryAPIResponse extends HelperInterface {
  articleCategories: ArticleCategoryInfoInterface[],
  allArticleCategories: ArticleCategoryInfoInterface[],
  code: number,
  message: string,
  keyword: string
}

export interface ArticleCategoryStates extends HelperInterface {
  articleCategories: ArticleCategoryInfoInterface[],
  allArticleCategories: ArticleCategoryInfoInterface[],
  keyword: string,
  sortKey: string,
  sortValue: string,
  loading: boolean
}

export type ArticleCategoryActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<ArticleCategoryStates> }

export interface ArticleCategoryDetailInterface {
  articleCategory: ArticleCategoryInfoInterface
}

export interface ArticleCategoryForm {
  title: string
  status: string
  descriptionShort: string
  descriptionDetail: string
  thumbnail: string
  children: ArticleInfoInterface[]
  slug: string
  parent_id: string
}