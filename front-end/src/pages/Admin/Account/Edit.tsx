import Skeleton from '@mui/material/Skeleton'
import useEdit from '~/hooks/Admin/account/useEdit'

const EditAccount = () => {
  const {
    roles,
    isLoading,
    role,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    watchedStatus,
    handleImageChange,
    onSubmit,
    preview,
    navigate,
    id
  } = useEdit()

  // Check permission
  if (!role || !role.permissions.includes('accounts_edit')) {
    return (
      <div className="bg-white p-6 rounded shadow-md mt-4">
        <p className="text-red-500 text-center">Bạn không có quyền truy cập trang này</p>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white p-[15px] shadow-md mt-[15px]">
        <Skeleton variant="text" width="40%" height={40} />
        <Skeleton variant="rectangular" width="100%" height={60} className="mt-4" />
        <Skeleton variant="rectangular" width="100%" height={60} className="mt-4" />
        <Skeleton variant="rectangular" width="100%" height={60} className="mt-4" />
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md mt-[15px]"
    >
      <h1 className="text-[24px] font-[600] text-[#192335]">Chỉnh sửa tài khoản admin</h1>

      {/* Avatar */}
      <div className="flex flex-col gap-[10px]">
        <label className="text-[#192335]">Avatar</label>
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

      {/* Full name */}
      <div className="form-group flex flex-col gap-2">
        <label className="text-[#192335]">
          Họ và tên <span className="text-red-500">*</span>
        </label>
        <input
          {...register('fullName')}
          className="py-[8px] px-[12px] border border-gray-300 rounded-[5px] focus:outline-none focus:border-[#525FE1] transition-colors"
        />
        {errors.fullName && (
          <p className="text-red-500 text-[14px]">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="form-group flex flex-col gap-2">
        <label className="text-[#192335]">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          {...register('email')}
          type="email"
          className="py-[8px] px-[12px] border border-gray-300 rounded-[5px] focus:outline-none focus:border-[#525FE1] transition-colors"
        />
        {errors.email && (
          <p className="text-red-500 text-[14px]">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="form-group flex flex-col gap-2">
        <label className="text-[#192335]">Số điện thoại <span className="text-red-500">*</span></label>
        <input
          {...register('phone')}
          type="tel"
          placeholder="VD: 0912345678"
          className="py-[8px] px-[12px] border border-gray-300 rounded-[5px] focus:outline-none focus:border-[#525FE1] transition-colors"
        />
        {errors.phone && (
          <p className="text-red-500 text-[14px]">{errors.phone.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="form-group flex flex-col gap-2">
        <label className="text-[#192335]">Mật khẩu mới</label>
        <input
          {...register('password')}
          type="password"
          placeholder="Để trống nếu không muốn đổi mật khẩu"
          className="py-[8px] px-[12px] border border-gray-300 rounded-[5px] focus:outline-none focus:border-[#525FE1] transition-colors"
        />
        {errors.password && (
          <p className="text-red-500 text-[14px]">{errors.password.message}</p>
        )}
      </div>

      {/* Role */}
      <div className="form-group flex flex-col gap-2">
        <label className="text-[#192335]">
          Phân quyền <span className="text-red-500">*</span>
        </label>
        <select
          {...register('role_id')}
          className="py-[8px] px-[12px] border border-gray-300 rounded-[5px] focus:outline-none focus:border-[#525FE1] transition-colors"
        >
          <option value="">-- Chọn phân quyền --</option>
          {roles.map(r => (
            <option key={r._id} value={r._id}>{r.title}</option>
          ))}
        </select>
        {errors.role_id && (
          <p className="text-red-500 text-[14px]">{errors.role_id.message}</p>
        )}
      </div>

      {/* Status */}
      <div className="flex flex-col gap-2">
        <label className="text-[#192335]">
          Trạng thái <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-[15px]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              {...register('status')}
              type="radio"
              value="ACTIVE"
              checked={watchedStatus === 'ACTIVE'}
              className="cursor-pointer"
            />
            <span>Hoạt động</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              {...register('status')}
              type="radio"
              value="INACTIVE"
              checked={watchedStatus === 'INACTIVE'}
              className="cursor-pointer"
            />
            <span>Dừng hoạt động</span>
          </label>
        </div>
      </div>

      {/* Submit buttons */}
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#525FE1] hover:bg-[#4248B8] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-[5px] px-6 py-[10px] transition-colors min-w-[120px]"
        >
          {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
        </button>
        <button
          type="button"
          onClick={() => navigate(`/admin/accounts/detail/${id}`)}
          disabled={isSubmitting}
          className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-[5px] px-6 py-[10px] transition-colors"
        >
          Hủy
        </button>
      </div>
    </form>
  )
}

export default EditAccount