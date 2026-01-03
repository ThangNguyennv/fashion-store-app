import type { ArticleInfoInterface } from './article.type'
import type { ArticleCategoryInfoInterface } from './articleCategory.type'
import type { ProductInfoInterface } from './product.type'
import type { ProductCategoryInfoInterface } from './productCategory.type'

export interface HomeAPIReponse {
  productCategories: ProductCategoryInfoInterface[],
  articleCategories: ArticleCategoryInfoInterface[],
  productsFeatured: ProductInfoInterface[],
  productsNew: ProductInfoInterface[],
  articlesFeatured: ArticleInfoInterface[],
  articlesNew: ArticleInfoInterface[]
}
