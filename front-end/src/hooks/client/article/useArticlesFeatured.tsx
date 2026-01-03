import { useHome } from '~/contexts/client/HomeContext'

const useArticlesFeatured = () => {
  const { dataHome } = useHome()
  const isLoading = !dataHome || !dataHome.articlesFeatured
  return {
    isLoading,
    dataHome
  }
}

export default useArticlesFeatured