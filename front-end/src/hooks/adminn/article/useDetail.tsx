import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailArticleAPI } from '~/apis/admin/article.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import type { ArticleDetailInterface, ArticleInfoInterface } from '~/types/article.type'

export const useDetail = () => {
  const [articleDetail, setArticleDetail] = useState<ArticleInfoInterface | null>(null)
  const params = useParams()
  const { role } = useAuth()
  const id = params.id

  useEffect(() => {
    if (!id) return
    fetchDetailArticleAPI(id)
      .then((response: ArticleDetailInterface) => {
        setArticleDetail(response.article)
      })
  }, [id])
  return {
    articleDetail,
    id,
    role
  }
}