import useCreate from '~/hooks/admin/account/useCreate'

const CreateAccount = () => {
  const {
    roles,
    preview,
    role,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleImageChange,
    onSubmit,
    handleClickUpload,
    uploadImageInputRef,
    navigate
  } = useCreate()

  return (
    <>
      {role && role.permissions.includes('accounts_create') && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md mt-[15px]"
        >
          <h1 className="text-[24px] font-[600] text-[#192335]">Thêm mới tài khoản</h1>

          {/* Họ và tên */}
          <div className="form-group">
            <label htmlFor="fullName">Họ và tên <span className="text-red-500">*</span></label>
            <input
              {...register('fullName')}
              type="text"
              id="fullName"
              className={`py-[3px] text-[16px] ${errors.fullName ? 'border-red-500' : ''}`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-[14px] mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email <span className="text-red-500">*</span></label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className={`py-[3px] text-[16px] ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="text-red-500 text-[14px] mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Mật khẩu */}
          <div className="form-group">
            <label htmlFor="password">Mật khẩu <span className="text-red-500">*</span></label>
            <input
              {...register('password')}
              type="password"
              id="password"
              className={`py-[3px] text-[16px] ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && (
              <p className="text-red-500 text-[14px] mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Số điện thoại */}
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại<span className="text-red-500">*</span></label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              className={`py-[3px] text-[16px] ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && (
              <p className="text-red-500 text-[14px] mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Avatar */}
          <div className="form-group">
            <label htmlFor="avatar">Avatar</label>
            <input
              onChange={handleImageChange}
              ref={uploadImageInputRef}
              type="file"
              id="avatar"
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={handleClickUpload}
              className="bg-[#9D9995] font-[500] border rounded-[5px] w-[5%] py-[4px] text-[14px]"
            >
              Chọn ảnh
            </button>
            {preview && (
              <img
                src={preview}
                alt="Avatar preview"
                className="border rounded-[5px] w-[150px] h-[150px] mt-2"
              />
            )}
          </div>

          {/* Phân quyền */}
          <div className="form-group">
            <label htmlFor="role_id">Phân quyền <span className="text-red-500">*</span></label>
            <select
              {...register('role_id')}
              id="role_id"
              className={`outline-none border rounded-[5px] border-[#192335] text-[16px] py-[3px] ${errors.role_id ? 'border-red-500' : ''}`}
            >
              <option value="">-- Chọn --</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.title}
                </option>
              ))}
            </select>
            {errors.role_id && (
              <p className="text-red-500 text-[14px] mt-1">{errors.role_id.message}</p>
            )}
          </div>

          {/* Trạng thái */}
          <div className="flex flex-col gap-2">
            <label className="text-[#192335]">
              Trạng thái <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center justify-start gap-[15px]">
              <div className="flex gap-[5px]">
                <input
                  {...register('status')}
                  type="radio"
                  className="border rounded-[5px] border-[#192635]"
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
          </div>

          {/* Submit button */}
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="p-[5px] border rounded-[5px] bg-[#525FE1] text-white text-[14px] w-[6%] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo mới'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/accounts')}
              disabled={isSubmitting}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-[5px] px-6 py-[10px] transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      )}
    </>
  )
}

export default CreateAccount