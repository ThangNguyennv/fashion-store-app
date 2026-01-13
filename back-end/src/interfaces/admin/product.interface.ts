export interface ProductInterface {
    title: string
    product_category_id: string
    featured: string
    description: string
    price: number
    discountPercentage: number
    stock: number
    colors: {
        name: string
        code: string,
        images: (File | string)[]
    }[]
    sizes: string[]
    thumbnail: string
    status: 'ACTIVE' | 'INACTIVE'
}