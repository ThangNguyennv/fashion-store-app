import { Editor } from '@tinymce/tinymce-react'
import { API_KEY } from '~/utils/constants'
import { useEdit } from '~/hooks/admin/articleCategory/useEdit'
import SelectTree from '~/components/admin/tableTree/SelectTreeArticle'
import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'

const EditArticleCategory = () => {
  const {
    isLoading,
    allArticleCategories,
    uploadImageInputRef,
    thumbnailPreview,
    handleThumbnailChange,
    handleClick,
    handleSubmit,
    role,
    register,
    errors,
    isSubmitting,
    setValue,
    watch
  } = useEdit()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md">
        <Skeleton variant="text" width={385} height={48} sx={{ bgcolor: 'grey.400' }}/>
        <div className="form-group">
          <Skeleton variant="text" width={40} height={32} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={1000} height={36} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <div className="form-group">
          <Skeleton variant="text" width={40} height={32} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={1000} height={36} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <div className="form-group">
          <Skeleton variant="text" width={40} height={32} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={1000} height={500} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <div className="form-group">
          <Skeleton variant="text" width={40} height={32} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={1000} height={500} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <div className="flex flex-col gap-[5px]">
          <Skeleton variant="text" width={40} height={32} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={100} height={36} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={100} height={36} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <div className="form-group">
          <Skeleton variant="text" width={40} height={32} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={1000} height={36} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <div className="flex items-center justify-start gap-[10px]">
          <Skeleton variant="rectangular" width={40} height={36} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={140} height={36} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <Skeleton variant="rectangular" width={91} height={37} sx={{ bgcolor: 'grey.400' }}/>
      </div>
    )
  }

  return (
    <>
      {role && role.permissions.includes('articles-category_edit') && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md"
        >
          <h1 className="text-[24px] font-[600] text-[#192335]">Chỉnh sửa danh mục bài viết</h1>

          <div className="form-group">
            <label htmlFor="title">Tiêu đề <span className="text-red-500">*</span></label>
            <input
              {...register('title')}
              type="text"
              id="title"
              className='py-[3px] text-[16px]'
            />
            {errors.title && (
              <span className="text-red-500 text-sm">{errors.title.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="parent_id">Danh mục cha</label>
            <select
              {...register('parent_id')}
              id="parent_id"
              className="outline-none border rounded-[5px] border-[#00171F] py-[3px] text-[16px]"
              defaultValue={watch('parent_id')}
            >
              <option value="">-- Chọn danh mục --</option>
              {allArticleCategories && allArticleCategories.length > 0 && (
                allArticleCategories.map(articleCategory => (
                  <SelectTree
                    key={articleCategory._id}
                    articleCategory={articleCategory}
                    level={1}
                    allArticleCategories={allArticleCategories}
                    parent_id={watch('parent_id') as string}
                  />
                ))
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="descriptionShort">Mô tả ngắn</label>
            <Editor
              apiKey={API_KEY}
              init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
              }}
              value={watch('descriptionShort')}
              onEditorChange={(newValue) => setValue('descriptionShort', newValue)}
              id="descriptionShort"
            />
          </div>

          <div className="form-group">
            <label htmlFor="descriptionDetail">Mô tả chi tiết</label>
            <Editor
              apiKey={API_KEY}
              init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
              }}
              value={watch('descriptionDetail')}
              onEditorChange={(newValue) => setValue('descriptionDetail', newValue)}
              id="descriptionDetail"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Ảnh đại diện <span className="text-red-500">*</span></label>
            <input
              onChange={handleThumbnailChange}
              ref={uploadImageInputRef}
              type="file"
              name="thumbnail"
              className='hidden'
              accept="image/*"
            />
            <button
              type="button"
              onClick={handleClick}
              className="bg-gray-400 font-semibold border rounded-md w-fit px-3 py-1 text-sm text-white"
            >
              Chọn ảnh
            </button>
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="border rounded-md w-40 h-40 object-cover"
              />
            )}
            {errors.thumbnail && (
              <span className="text-red-500 text-sm">{errors.thumbnail.message as string}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label>Trạng thái <span className="text-red-500">*</span></label>
            <div className="flex items-center justify-start gap-[10px] text-[16px]">
              <div className="flex gap-[5px]">
                <input
                  {...register('status')}
                  type="radio"
                  className="border rounded-[5px] border-[#192335]"
                  id="statusActive"
                  value="ACTIVE"
                />
                <label htmlFor="statusActive">Hoạt động</label>
              </div>

              <div className="flex gap-[5px]">
                <input
                  {...register('status')}
                  type="radio"
                  className="border rounded-[5px] border-[#192335]"
                  id="statusInActive"
                  value="INACTIVE"
                />
                <label htmlFor="statusInActive">Dừng hoạt động</label>
              </div>
            </div>
            {errors.status && (
              <span className="text-red-500 text-sm">{errors.status.message}</span>
            )}
          </div>

          <div className='flex items-center justify-start text-center gap-[5px]'>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-[8%] border rounded-[5px] bg-[#525FE1] text-white p-[7px] text-[14px] disabled:opacity-50"
            >
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
            <Link
              to="/admin/articles-category"
              className="w-[6%] border rounded-[5px] bg-[#525FE1] text-white p-[7px] text-[14px]"
            >
              Hủy
            </Link>
          </div>
        </form>
      )}
    </>
  )
}

export default EditArticleCategory