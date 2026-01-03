import { useHome } from '~/contexts/client/HomeContext'

const useProductsFeatured = () => {
  const { dataHome } = useHome()
  const isLoading = !dataHome || !dataHome.productsFeatured
  return {
    dataHome,
    isLoading
  }
}

export default useProductsFeatured