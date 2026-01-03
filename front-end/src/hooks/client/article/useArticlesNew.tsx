import { useHome } from '~/contexts/client/HomeContext'

const useArticlesNew = () => {
  const { dataHome } = useHome()
  const isLoading = !dataHome || !dataHome.articlesNew
  return {
    isLoading,
    dataHome
  }
}

export default useArticlesNew