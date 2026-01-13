import type { ArticleInfoInterface } from './article.interface'
import type { ArticleCategoryInfoInterface } from './articleCategory.interface'
import type { ProductInfoInterface } from './product.interface'
import type { ProductCategoryInfoInterface } from './productCategory.interface'

export interface HomeAPIReponse {
  productCategories: ProductCategoryInfoInterface[],
  articleCategories: ArticleCategoryInfoInterface[],
  productsFeatured: ProductInfoInterface[],
  productsNew: ProductInfoInterface[],
  articlesFeatured: ArticleInfoInterface[],
  articlesNew: ArticleInfoInterface[]
}
