import useEdit from '~/hooks/client/myAccount/useEdit'

const EditMyAccountClient = () => {
  const {
    setAccountUser,
    handleClick,
    handleSubmit,
    handleChange,
    accountUser,
    uploadImageInputRef,
    uploadImagePreviewRef
  } = useEdit()

  return (
    <>
      {accountUser && (
        <form
          onSubmit={(event) => handleSubmit(event)}
          className='w-[70%] flex justify-around gap-[15px] border rounded-[15px] p-[15px]'
          encType="multipart/form-data"
        >
          <div className='flex flex-col gap-[15px] w-[40%]'>
            <h1 className='text-[25px] font-[600]'>Chỉnh sửa hồ sơ của tôi</h1>
            <div className='flex flex-col gap-[10px]'>
              <div className='form-group'>
                <label htmlFor='fullName'>Họ và tên: </label>
                <input
                  onChange={(event) => setAccountUser({ ...accountUser, fullName: event.target.value })}
                  type='text'
                  id='fullName'
                  name='fullName'
                  value={accountUser.fullName}
                  className='py-[3px]'
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='email'>Email:</label>
                <input
                  onChange={(event) => setAccountUser({ ...accountUser, email: event.target.value })}
                  type='email'
                  id='email'
                  name='email'
                  value={accountUser.email}
                  className='py-[3px]'
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='phone'>Số điện thoại:</label>
                <input
                  onChange={(event) => setAccountUser({ ...accountUser, phone: event.target.value })}
                  type='tel'
                  id='phone'
                  name='phone'
                  value={accountUser.phone}
                  className='py-[3px]'
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='address'>Địa chỉ:</label>
                <input
                  onChange={(event) => setAccountUser({ ...accountUser, address: event.target.value })}
                  type='text'
                  id='address'
                  name='address'
                  value={accountUser.address}
                  className='py-[3px]'
                  required
                />
              </div>
              <button
                type='submit'
                className='border rounded-[5px] p-[7px] bg-[#525FE1] text-white text-center w-[20%] text-[14px]'
              >
                Cập nhật
              </button>
            </div>
          </div>
          <div className='flex flex-col gap-[5px] text-center items-center'>
            <label
              htmlFor='avatar'
              className='text-[20px] font-[600]'
            >
              Ảnh đại diện:
            </label>
            <input
              onChange={(event) => handleChange(event)}
              ref={uploadImageInputRef}
              type="file"
              className="hidden"
              name="avatar"
              accept="image/*"
            />
            <button
              onClick={event => handleClick(event)}
              className="bg-[#9D9995] font-[500] border rounded-[5px] w-[32%] py-[3px] text-[14px]"
            >
              Chọn ảnh
            </button>
            <img
              className='border rounded-[100%] w-[250px] h-[250px]'
              ref={uploadImagePreviewRef}
              src={accountUser.avatar}
              alt="Avatar preview"
            />
          </div>
        </form>
      )}
    </>
  )
}

export default EditMyAccountClient