import Skeleton from '@mui/material/Skeleton'
import useEdit from '~/hooks/Admin/settingsGeneral/useEdit'

const EditSettingGeneral = () => {
  const {
    isLoading,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleImageChange,
    onSubmit,
    preview,
    navigate
  } = useEdit()

  return (
    <>
      {!isLoading ? (
        <>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-[15px] w-full text-[17px] bg-[#FFFFFF] py-[15px] px-[50px] shadow-md mt-[15px]'
          >
            <h1 className='text-[24px] font-[700]'>Chỉnh sửa cài đặt chung</h1>
            <div className='form-group'>
              <label htmlFor='websiteName'>
                <b>Tên website <span className="text-red-500">*</span></b>
              </label>
              <input
                className='border p-[5px] rounded-[5px] text-[16px]'
                {...register('websiteName')}
              />
              {errors.websiteName && (
                <p className="text-red-500 text-[14px]">{errors.websiteName.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-[10px]">
              <label className="text-[#192335]">
                <b>Logo</b>
              </label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="avatar-upload"
                onChange={handleImageChange}
              />
              <label
                htmlFor="avatar-upload"
                className="bg-[#9D9995] hover:bg-[#87857F] transition-colors border rounded-[5px] w-[100px] inline-block px-4 py-2 text-[14px] cursor-pointer text-center text-white"
              >
                Chọn ảnh
              </label>
              {preview ? (
                <img
                  src={preview}
                  alt="Avatar preview"
                  className="w-[150px] h-[150px] rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <Skeleton variant="circular" width={150} height={150} />
              )}
            </div>
            <div className='form-group'>
              <label htmlFor='phone'>
                <b>Số điện thoại <span className="text-red-500">*</span></b>
              </label>
              <input
                {...register('phone')}
                type='text'
                id='phone'
                name='phone'
                className='border p-[5px] rounded-[5px] text-[16px]'
              />
              {errors.phone && (
                <p className="text-red-500 text-[14px]">{errors.phone.message}</p>
              )}
            </div>
            <div className='form-group'>
              <label htmlFor='email'>
                <b>Email <span className="text-red-500">*</span></b>
              </label>
              <input
                {...register('email')}
                type='email'
                id='email'
                name='email'
                className='border p-[5px] rounded-[5px] text-[16px]'
              />
              {errors.email && (
                <p className="text-red-500 text-[14px]">{errors.email.message}</p>
              )}
            </div>
            <div className='form-group'>
              <label htmlFor='address'>
                <b>Địa chỉ <span className="text-red-500">*</span></b>
              </label>
              <input
                {...register('address')}
                type='text'
                id='address'
                name='address'
                className='border p-[5px] rounded-[5px] text-[16px]'
              />
              {errors.address && (
                <p className="text-red-500 text-[14px]">{errors.address.message}</p>
              )}
            </div>
            <div className='form-group'>
              <label htmlFor='copyright'>
                <b>Bản quyền <span className="text-red-500">*</span></b>
              </label>
              <input
                {...register('copyright')}
                type='text'
                id='copyright'
                name='copyright'
                className='border p-[5px] rounded-[5px] text-[16px]'
              />
              {errors.copyright && (
                <p className="text-red-500 text-[14px]">{errors.copyright.message}</p>
              )}
            </div>
            <div>
              <button
                type='submit'
                disabled={isSubmitting}
                className='cursor-pointer border rounded-[5px] bg-[#525FE1] text-white p-[5px] w-[9%] text-[14px]'>
                {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
              <button type='button' onClick={() => navigate('/admin/settings/general')} disabled={isSubmitting}
                className='ml-[10px] cursor-pointer border rounded-[5px] bg-gray-400 text-white p-[5px] w-[6%] text-[14px]'>
                Hủy
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <div className='flex flex-col gap-[15px] w-full text-[17px] bg-[#FFFFFF] py-[15px] px-[50px] shadow-md mt-[15px]'>
            <Skeleton variant="text" width={250} height={32} sx={{ bgcolor: 'grey.400' }}/>
            <div className='form-group'>
              <Skeleton variant="text" width={80} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={500} height={31} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <div className='flex flex-col gap-[10px]'>
              <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <div className='flex flex-col gap-[10px]'>
                <Skeleton variant="rectangular" width={70} height={31} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="rectangular" width={100} height={100} sx={{ bgcolor: 'grey.400' }}/>
              </div>
            </div>
            <div className='form-group'>
              <Skeleton variant="text" width={250} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={94} height={31} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <div className='form-group'>
              <Skeleton variant="text" width={80} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={500} height={31} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <div className='form-group'>
              <Skeleton variant="text" width={80} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={500} height={31} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <div className='form-group'>
              <Skeleton variant="text" width={80} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={500} height={31} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <Skeleton variant="rectangular" width={94} height={31} sx={{ bgcolor: 'grey.400' }}/>
          </div>
        </>
      )}
    </>
  )
}

export default EditSettingGeneral