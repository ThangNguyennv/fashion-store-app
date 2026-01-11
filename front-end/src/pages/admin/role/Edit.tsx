import { Editor } from '@tinymce/tinymce-react'
import { API_KEY } from '~/utils/constants'
import useEdit from '~/hooks/admin/role/useEdit'
import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'

const EditRole = () => {
  const {
    handleSubmit,
    register,
    errors,
    role,
    hasData,
    setValue,
    watch,
    isSubmitting
  } = useEdit()

  const descriptionValue = watch('description')

  return (
    <>
      {role?.permissions.includes('roles_edit') && (
        hasData ? (
          <form onSubmit={handleSubmit} className='flex flex-col gap-[15px] bg-white p-[15px] shadow-md'>
            <h1 className="text-[24px] font-[600]">Chỉnh sửa nhóm quyền</h1>

            <div className='form-group flex flex-col'>
              <label htmlFor='title'>Tiêu đề</label>
              <input
                {...register('title')}
                type='text'
                className='border p-2'
              />
              {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
            </div>

            <div className='form-group flex flex-col'>
              <label htmlFor='titleId'>Mã định danh</label>
              <input
                {...register('titleId')}
                type='text'
                className='border p-2'
              />
              {errors.titleId && <span className="text-red-500 text-sm">{errors.titleId.message}</span>}
            </div>

            <div className="form-group">
              <label>Mô tả</label>
              <Editor
                apiKey={API_KEY}
                value={descriptionValue}
                onEditorChange={(content) => setValue('description', content)}
                init={{ /* ...config của bạn... */ }}
              />
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
                to="/admin/roles"
                className="w-[6%] border rounded-[5px] bg-[#525FE1] text-white p-[7px] text-[14px]"
              >
                Hủy
              </Link>
            </div>
          </form>
        ) : (
          <div className='flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md'>
            <h1 className="text-[24px] font-[600] text-[#192335]">Chỉnh sửa nhóm quyền</h1>
            <div className='form-group'>
              <Skeleton variant="text" width={60} height={30} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={1000} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>

            <div className="form-group">
              <Skeleton variant="text" width={60} height={30} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={1000} height={500} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <Skeleton variant="rectangular" width={100} height={50} sx={{ bgcolor: 'grey.400' }}/>
          </div>
        )
      )}
    </>
  )
}

export default EditRole