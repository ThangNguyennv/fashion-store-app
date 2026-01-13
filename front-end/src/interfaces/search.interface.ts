import type { ProductInfoInterface } from './product.interface'

export interface SearchInterface {
    products: ProductInfoInterface[],
    keyword: string,
}