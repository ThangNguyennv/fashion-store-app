export interface ArticleInterface {
    title: string
    article_category_id: string
    featured: string
    descriptionShort: string
    descriptionDetail: string
    status: 'ACTIVE' | 'INACTIVE'
    thumbnail: any
}