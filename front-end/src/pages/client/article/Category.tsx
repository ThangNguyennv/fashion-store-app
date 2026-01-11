import { Link } from 'react-router-dom'
import ArticleCard from '~/components/client/articleCard/ArticleCard'
import BoxHead from '~/components/client/boxHead/BoxHead'
import useCategory from '~/hooks/client/article/useCategory'

const ArticleCategory = () => {
  const {
    pageTitle,
    articleCategory
  } = useCategory()

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="container flex flex-col mb-[150px]">
          <BoxHead title={pageTitle}/>
          {articleCategory && (
            <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[15px]'>
              {articleCategory.map((article, index) => (
                <Link to={`/articles/detail/${article.slug}`} key={index}>
                  <ArticleCard item={article}/>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ArticleCategory