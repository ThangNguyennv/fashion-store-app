import type { ProductCategoryInfoInterface } from '~/types/productCategory.type'

interface Props {
  productCategory: ProductCategoryInfoInterface
  level: number
  allProductCategories: ProductCategoryInfoInterface[]
  parent_id: string
}

const SelectTreeProduct = ({ productCategory, level, allProductCategories, parent_id }: Props) => {
  const prefix = '- '.repeat(level)

  return (
    <>
      <option
        value={productCategory._id}
        selected={parent_id === productCategory._id}
      >
        {prefix}{productCategory.title}
      </option>
      {productCategory.children?.map((child) => (
        <SelectTreeProduct
          key={child._id}
          productCategory={child}
          level={level + 1}
          allProductCategories={allProductCategories}
          parent_id={parent_id}
        />
      ))}
    </>
  )
}

export default SelectTreeProduct