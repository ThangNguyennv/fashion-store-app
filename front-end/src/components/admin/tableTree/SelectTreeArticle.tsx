import type { ArticleCategoryInfoInterface } from '~/interfaces/articleCategory.interface'

interface Props {
  articleCategory: ArticleCategoryInfoInterface
  level: number
  allArticleCategories: ArticleCategoryInfoInterface[]
  parent_id: string
}

const SelectTreeArticle = ({ articleCategory, level, allArticleCategories, parent_id }: Props) => {
  const prefix = '- '.repeat(level)
  return (
    <>
      <option
        value={articleCategory._id}
        selected={parent_id == articleCategory._id}
      >
        {prefix}{articleCategory.title}
      </option>
      {articleCategory.children?.map((child) => (
        <SelectTreeArticle
          key={child._id}
          articleCategory={child}
          level={level + 1}
          allArticleCategories={allArticleCategories}
          parent_id={parent_id}
        />
      ))}
    </>
  )
}

export default SelectTreeArticle