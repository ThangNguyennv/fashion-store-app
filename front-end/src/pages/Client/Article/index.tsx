import { Link } from 'react-router-dom'
import BoxHead from '~/components/Client/BoxHead/BoxHead'
import Pagination from '~/components/Admin/Pagination/Pagination'
import useIndex from '~/hooks/client/article/useIndex'
import ArticleCard from '~/components/Client/ArticleCard/ArticleCard'
import Skeleton from '@mui/material/Skeleton'

const CardItemSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-[15px] rounded-[5px] border border-gray-200 bg-white p-[10px] shadow-sm h-full">
      <div className="w-full overflow-hidden rounded-md pt-2">
        <Skeleton
          variant="rectangular"
          width="100%"
          className="h-[200px] sm:h-[250px] w-full"
          animation="wave"
        />
      </div>

      <div className="flex flex-col items-center gap-2 px-2 pb-2 w-full">
        <Skeleton variant="text" width="90%" height={24} animation="wave" />
        <Skeleton variant="text" width="60%" height={24} animation="wave" />
      </div>
    </div>
  )
}

const ArticleClient = () => {
  const {
    articles,
    pagination,
    updateParams,
    loading
  } = useIndex()

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="container flex flex-col mb-[100px]">
          <BoxHead title={'Tất cả bài viết'} />

          {loading ? (
            <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[15px]'>
              {Array.from({ length: 8 }).map((_, index) => (
                <CardItemSkeleton key={index} />
              ))}
            </div>
          ) : articles.length > 0 ? (
            <>
              <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[15px]'>
                {articles.map((article, index) => (
                  <Link to={`/articles/detail/${article.slug}`} key={index}>
                    <ArticleCard item={article} />
                  </Link>
                ))}
              </div>
              <Pagination
                pagination={pagination}
                handlePagination={(page: number) => updateParams({ page: page })}
                handlePaginationPrevious={(page: number) => updateParams({ page: page - 1 })}
                handlePaginationNext={(page: number) => updateParams({ page: page + 1 })}
                items={articles}
              />
            </>
          ) : (
            <p className="text-center text-gray-500 py-16">Không tồn tại bài viết nào.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default ArticleClient