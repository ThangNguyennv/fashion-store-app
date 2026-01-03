import { useHome } from '~/contexts/client/HomeContext'

const useProductsNew = () => {
  const { dataHome } = useHome()
  const isLoading = !dataHome || !dataHome.productsNew
  return {
    dataHome,
    isLoading
  }
}

export default useProductsNew