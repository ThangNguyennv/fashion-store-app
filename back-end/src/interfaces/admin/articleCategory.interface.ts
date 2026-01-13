export interface ArticleCategoryInterface {
  title: string
  parent_id: string
  descriptionShort: string
  descriptionDetail: string
  status: 'ACTIVE' | 'INACTIVE'
  thumbnail: any
}