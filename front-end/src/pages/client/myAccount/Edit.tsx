import useEdit from '~/hooks/client/myAccount/useEdit'

const EditMyAccountClient = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleClickUpload,
    handleChangeImage,
    accountUser,
    uploadImageInputRef,
    previewAvatar
  } = useEdit()

  return (
    <>
      {accountUser ? (
        <form
          onSubmit={handleSubmit}
          className='
            mx-auto /* Căn giữa form */
            flex
            w-[95%] sm:w-[90%] lg:w-[70%] /* Mobile rộng 95%, PC về 70% */
            flex-col-reverse md:flex-row /* Mobile: Ảnh lên đầu (nhờ reverse), PC: Ngang */
            justify-between md:justify-around
            gap-8 md:gap-[15px] /* Tăng khoảng cách trên mobile cho thoáng */
            border rounded-[15px]
            p-4 md:p-[20px]
            bg-white shadow-sm
          '
          encType="multipart/form-data"
        >

          {/* --- CỘT 1: FORM NHẬP LIỆU --- */}
          {/* Mobile: full width, PC: khoảng 55-60% */}
          <div className='flex flex-col gap-[15px] w-full md:w-[60%] lg:w-[55%]'>
            <h1 className='text-[22px] md:text-[25px] font-[600] text-center md:text-left'>
              Chỉnh sửa hồ sơ của tôi
            </h1>

            <div className='flex flex-col gap-[15px]'>
              {/* Họ tên */}
              <div className='form-group flex flex-col gap-2'>
                <label htmlFor='fullName' className="font-medium">Họ và tên: </label>
                <input
                  type='text'
                  id='fullName'
                  className={`py-2 px-3 border rounded focus:outline-none focus:ring-1 focus:ring-[#525FE1] transition-all ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('fullName')}
                />
                {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName.message}</span>}
              </div>

              {/* Email */}
              <div className='form-group flex flex-col gap-2'>
                <label htmlFor='email' className="font-medium">Email:</label>
                <input
                  type='email'
                  id='email'
                  disabled // Thường email không cho sửa, thêm style disabled nếu cần
                  className={`py-2 px-3 border rounded bg-gray-50 text-gray-500 cursor-not-allowed ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('email')}
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
              </div>

              {/* Số điện thoại */}
              <div className='form-group flex flex-col gap-2'>
                <label htmlFor='phone' className="font-medium">Số điện thoại:</label>
                <input
                  type='tel'
                  id='phone'
                  className={`py-2 px-3 border rounded focus:outline-none focus:ring-1 focus:ring-[#525FE1] ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('phone')}
                />
                {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
              </div>

              {/* Địa chỉ */}
              <div className='form-group flex flex-col gap-2'>
                <label htmlFor='address' className="font-medium">Địa chỉ:</label>
                <input
                  type='text'
                  id='address'
                  className={`py-2 px-3 border rounded focus:outline-none focus:ring-1 focus:ring-[#525FE1] ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('address')}
                />
                {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
              </div>

              {/* Button Submit */}
              <button
                type='submit'
                disabled={isSubmitting}
                className={`
                  border rounded-[5px] p-[10px] 
                  text-white text-center text-[14px] font-medium
                  mt-4
                  w-full sm:w-[50%] md:w-[120px] /* Mobile full width cho dễ bấm */
                  transition-colors
                  ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#525FE1] hover:bg-[#414cb3]'}
                `}
              >
                {isSubmitting ? 'Đang lưu...' : 'Cập nhật'}
              </button>
            </div>
          </div>

          {/* --- CỘT 2: ẢNH ĐẠI DIỆN --- */}
          {/* Mobile: full width, PC: phần còn lại */}
          <div className='flex flex-col gap-[10px] items-center text-center w-full md:w-[35%]'>
            <label
              htmlFor='avatar'
              className='text-[20px] font-[600]'
            >
              Ảnh đại diện:
            </label>

            {/* Input file ẩn */}
            <input
              onChange={handleChangeImage}
              ref={uploadImageInputRef}
              type="file"
              className="hidden"
              name="avatar"
              accept="image/*"
            />

            {/* Nút chọn ảnh */}
            <button
              type="button" // Quan trọng: type button để không kích hoạt submit form
              onClick={handleClickUpload}
              className="
                bg-[#9D9995] text-white font-[500]
                border rounded-[5px]
                px-4 py-2 text-[14px]
                hover:bg-[#86827e] transition-colors
              "
            >
              Chọn ảnh
            </button>

            {/* Preview Ảnh */}
            <div className="relative mt-2">
              <img
                className='
                  border rounded-full object-cover shadow-sm
                  w-[150px] h-[150px] /* Mobile */
                  sm:w-[200px] sm:h-[200px]
                  lg:w-[250px] lg:h-[250px] /* PC */
                '
                src={previewAvatar || accountUser.avatar}
                alt="Avatar preview"
              />
            </div>
          </div>
        </form>
      ) : (
        <div className="w-full text-center py-10 text-gray-500">Đang tải thông tin...</div>
      )}
    </>
  )
}

export default EditMyAccountClient