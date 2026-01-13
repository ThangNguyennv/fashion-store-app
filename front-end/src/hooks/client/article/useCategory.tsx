import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailArticleCategoryAPI } from '~/apis/client/article.api'
import type { ArticleInfoInterface, ArticlesWithCategoryDetailInterface } from '~/interfaces/article.interface'

const useCategory = () => {
  const [articleCategory, setArticleCategory] = useState<ArticleInfoInterface[]>([])
  const [pageTitle, setPageTitle] = useState('')
  const params = useParams()
  const slugCategory = params.slugCategory as string

  useEffect(() => {
    fetchDetailArticleCategoryAPI(slugCategory). then((res: ArticlesWithCategoryDetailInterface) => {
      setArticleCategory(res.articles)
      setPageTitle(res.pageTitle)
    })
  }, [slugCategory])
  return {
    pageTitle,
    articleCategory
  }
}

export default useCategory