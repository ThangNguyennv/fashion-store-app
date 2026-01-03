import { Link } from 'react-router-dom'
import ArticleCard from '~/components/Client/ArticleCard/ArticleCard'
import BoxHead from '~/components/Client/BoxHead/BoxHead'
import Skeleton from '@mui/material/Skeleton'
import useArticlesNew from '~/hooks/client/article/useArticlesNew'

const ArticlesNew = () => {
  const {
    isLoading,
    dataHome
  } = useArticlesNew()

  const CardItemSkeleton = () => (
    <div className="flex flex-col items-center gap-[15px] rounded-[5px] border border-gray-200 bg-white p-[10px] text-center h-full">
      <Skeleton variant="rectangular" width="100%" height={250} />
      <div className="flex flex-col items-center gap-2 px-2 pb-2 w-full">
        <Skeleton variant="text" width="90%" height={24} />
        <Skeleton variant="text" width="70%" height={20} />
        <Skeleton variant="text" width="50%" height={28} />
      </div>
    </div>
  )
  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center">
          <div className="container flex flex-col mb-[150px]">
            <BoxHead title={'bài viết mới'}/>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {
              // Hiển thị 8 skeleton để lấp đầy màn hình
                Array.from({ length: 8 }).map((_, index) => (
                  <CardItemSkeleton key={index} />
                ))
              }
            </div>
          </div>
        </div>
      </>
    )
  }
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="container flex flex-col mb-[150px]">
          <BoxHead title={'Bài viết mới'}/>
          {dataHome && dataHome.articlesNew.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {dataHome.articlesNew.map((article) => (
                <Link to={`/articles/detail/${article.slug}`} key={article._id || article.slug}>
                  <ArticleCard item={article}/>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Không có bài viết mới nào.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default ArticlesNew