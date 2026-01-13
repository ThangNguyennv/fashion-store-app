/* eslint-disable no-console */
// ~/hooks/client/article/useDetail.ts
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailArticleAPI } from '~/apis/client/article.api' // (Giả sử bạn đã có hàm này)
import type { ArticleDetailInterface, ArticleInfoInterface } from '~/interfaces/article.interface'

const useDetail = () => {
  const [articleDetail, setArticleDetail] = useState<ArticleInfoInterface | null>(null)
  const [loading, setLoading] = useState(true) // THÊM STATE NÀY
  const params = useParams()
  const slugArticle = params.slugArticle as string

  useEffect(() => {
    if (!slugArticle) return
    const fetchData = async () => {
      setLoading(true)
      try {
        const res: ArticleDetailInterface = await fetchDetailArticleAPI(slugArticle)
        setArticleDetail(res.article)
      } catch (error) {
        console.error('Lỗi khi fetch chi tiết bài viết:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slugArticle])

  return {
    articleDetail,
    loading // TRẢ RA STATE NÀY
  }
}

export default useDetail