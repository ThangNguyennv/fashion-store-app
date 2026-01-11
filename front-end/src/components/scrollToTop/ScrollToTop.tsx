import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
  // Các thuộc tính có sẵn của useLocation
  const { pathname, search } = useLocation()

  useEffect(() => {
    // Cuộn lên đầu trang
    window.scrollTo(0, 0)
  }, [pathname, search])

  return null
}

export default ScrollToTop
