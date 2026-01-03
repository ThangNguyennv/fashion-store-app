import { Editor } from '@tinymce/tinymce-react'
import { API_KEY } from '~/utils/constants'
import { useEdit } from '~/hooks/Admin/Product/useEdit'
import SelectTree from '~/components/Admin/TableTree/SelectTreeProduct'
import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'

const EditProduct = () => {
  const {
    isLoading,
    allProductCategories,
    uploadImageInputRef,
    colorFileInputRefs,
    handleSubmit,
    handleClick,
    role,
    handleRemoveColor,
    handleRemoveSize,
    thumbnailPreview,
    handleThumbnailChange,
    handleAddImagesToColor,
    handleRemoveImageFromColor,
    showPopupSize,
    showPopupColor,
    availableSizes,
    availableColors,
    handleOpenPopupColor,
    handleClosePopupColor,
    handleToggleColor,
    handleSelectAllColors,
    handleDeselectAllColors,
    handleConfirmSelectionColors,
    tempSelectedColors,
    handleOpenPopupSize,
    handleClosePopupSize,
    handleToggleSize,
    handleSelectAllSizes,
    handleDeselectAllSizes,
    handleConfirmSelectionSizes,
    tempSelectedSizes,
    register,
    errors,
    isSubmitting,
    setValue,
    watch,
    colors,
    sizes
  } = useEdit()

  if (isLoading) {
    return (
      <>
        <Skeleton variant="text" width={470} height={30} sx={{ bgcolor: 'grey.400' }} />
        <form className="flex flex-col gap-[10px] text-[17px] font-[500]">
          <div className="form-group">
            <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }} />
            <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }} />
          </div>
          <div className="form-group">
            <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }} />
            <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }} />
          </div>
          <div className="flex items-center justify-start gap-[10px]">
            <Skeleton variant="rectangular" width={100} height={32} sx={{ bgcolor: 'grey.400' }} />
            <Skeleton variant="rectangular" width={100} height={32} sx={{ bgcolor: 'grey.400' }} />
          </div>
          <div className="form-group">
            <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }} />
            <Skeleton variant="rectangular" width={1000} height={400} sx={{ bgcolor: 'grey.400' }} />
          </div>
          <div className="form-group">
            <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }} />
            <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }} />
          </div>
          <Skeleton variant="rectangular" width={100} height={50} sx={{ bgcolor: 'grey.400' }} />
        </form>
      </>
    )
  }

  return (
    <>
      {role && role.permissions.includes('products_edit') && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md"
        >
          <h1 className="text-[24px] font-[600] text-[#192335]">Chỉnh sửa sản phẩm</h1>

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
            <label htmlFor="product_category_id">Danh mục <span className="text-red-500">*</span></label>
            <select
              {...register('product_category_id')}
              id="product_category_id"
              className="outline-none border rounded-[5px] border-[#00171F] py-[3px] text-[16px]"
            >
              <option value={''}>-- Chọn danh mục --</option>
              {allProductCategories && allProductCategories.length > 0 && (
                allProductCategories.map(productCategory => (
                  <SelectTree
                    key={productCategory._id}
                    productCategory={productCategory}
                    level={1}
                    allProductCategories={allProductCategories}
                    parent_id={watch('product_category_id')}
                  />
                ))
              )}
            </select>
            {errors.product_category_id && (
              <span className="text-red-500 text-sm">{errors.product_category_id.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label>Đặc trưng <span className="text-red-500">*</span></label>
            <div className="flex items-center justify-start gap-[10px] text-[16px]">
              <div className="flex gap-[5px]">
                <input
                  {...register('featured')}
                  type="radio"
                  className="border rounded-[5px] border-[#192335]"
                  id="featured1"
                  value={'1'}
                />
                <label htmlFor="featured1">Nổi bật</label>
              </div>
              <div className="flex gap-[5px]">
                <input
                  {...register('featured')}
                  type="radio"
                  className="border rounded-[5px] border-[#192335]"
                  id="featured0"
                  value={'0'}
                />
                <label htmlFor="featured0">Không nổi bật</label>
              </div>
            </div>
            {errors.featured && (
              <span className="text-red-500 text-sm">{errors.featured.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="desc">Mô tả</label>
            <Editor
              apiKey={API_KEY}
              init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
              }}
              value={watch('description')}
              onEditorChange={(newValue) => setValue('description', newValue)}
              id="desc"
              textareaName="description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Giá</label>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number"
              id="price"
              className='text-[16px] py-[3px]'
              min={0}
            />
            {errors.price && (
              <span className="text-red-500 text-sm">{errors.price.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="discount">% Giảm giá</label>
            <input
              {...register('discountPercentage', { valueAsNumber: true })}
              type="number"
              id="discount"
              className='text-[16px] py-[3px]'
              min={0}
              max={100}
            />
            {errors.discountPercentage && (
              <span className="text-red-500 text-sm">{errors.discountPercentage.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="stock">Số lượng <span className="text-red-500">*</span></label>
            <input
              {...register('stock', { valueAsNumber: true })}
              type="number"
              id="stock"
              className='text-[16px] py-[3px]'
              min={1}
            />
            {errors.stock && (
              <span className="text-red-500 text-sm">{errors.stock.message}</span>
            )}
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
              onClick={(event) => handleClick(event, uploadImageInputRef)}
              className="bg-gray-400 font-semibold border rounded-md w-fit px-3 py-1 text-sm text-white"
            >
              Chọn ảnh
            </button>
            {thumbnailPreview && (
              <img src={thumbnailPreview} alt="Thumbnail preview" className="border rounded-md w-40 h-40 object-cover" />
            )}
            {errors.thumbnail && (
              <span className="text-red-500 text-sm">{errors.thumbnail.message as string}</span>
            )}
          </div>

          <div className="form-group">
            <label>Danh sách các màu <span className="text-red-500">*</span></label>
            <button
              type='button'
              onClick={handleOpenPopupColor}
              className={`w-full text-left border-2 border-dashed rounded-lg px-4 py-3 hover:border-blue-500 hover:bg-blue-50 transition-colors mb-3 ${
                errors.colors ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <span className="text-gray-500">+ Nhấn để chọn màu sắc</span>
            </button>
            {errors.colors && (
              <span className="text-red-500 text-sm block mb-2">{errors.colors.message}</span>
            )}

            {/* Danh sách các màu đã thêm */}
            <div className="flex flex-col gap-4 mt-2">
              {colors.map((color, colorIndex) => (
                <div key={colorIndex} className="border p-4 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span style={{ backgroundColor: color.code }} className="w-6 h-6 rounded-full border"></span>
                      <span className='font-semibold'>{color.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(colorIndex)}
                      className="font-bold text-red-500 text-2xl"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="mt-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      ref={el => { colorFileInputRefs.current[colorIndex] = el }}
                      onChange={(e) => handleAddImagesToColor(colorIndex, e)}
                    />
                    <button
                      type="button"
                      onClick={(e) => handleClick(e, { current: colorFileInputRefs.current[colorIndex] })}
                      className="bg-gray-200 px-3 py-1 text-sm rounded"
                    >
                      + Thêm ảnh
                    </button>
                  </div>

                  {/* Preview ảnh */}
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {color.images && color.images.map((image, imgIndex) => (
                      <div key={imgIndex} className="relative group">
                        <img
                          src={image instanceof File ? URL.createObjectURL(image) : image}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImageFromColor(colorIndex, imgIndex)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100"
                        >
                            &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  {(!color.images || color.images.length === 0) && (
                    <p className="text-red-500 text-sm mt-2">Vui lòng thêm ít nhất 1 ảnh cho màu này</p>
                  )}
                </div>
              ))}
              {colors.length === 0 && (
                <p className="text-gray-400 text-sm">Chưa chọn màu nào</p>
              )}
            </div>
          </div>

          {showPopupColor && (
            <div className="fixed inset-0 left-[150px] bottom-[-200px] flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4">Chọn màu sắc</h3>

                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={handleSelectAllColors}
                    className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                      Chọn tất cả
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAllColors}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                      Bỏ chọn tất cả
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 max-h-96 overflow-y-auto">
                  {availableColors.map(( color: { code: string, name: string}) => {
                    const isSelected = tempSelectedColors.some(c => c.code === color.code)
                    return (
                      <button
                        key={color.code}
                        type="button"
                        onClick={() => handleToggleColor(color)}
                        className={`py-3 px-4 rounded-lg font-medium transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600'
                        }`}
                      >
                        <span
                          style={{ backgroundColor: color.code }}
                          className="w-6 h-6 rounded-full border-2 border-gray-400 flex-shrink-0"
                        ></span>
                        <span className="flex-1 text-left">{color.name}</span>
                        {isSelected && <span>✓</span>}
                      </button>
                    )
                  })}
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={handleClosePopupColor}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSelectionColors}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Xong
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Danh sách kích cỡ <span className="text-red-500">*</span></label>
            <button
              type="button"
              onClick={handleOpenPopupSize}
              className={`w-full text-left border-2 border-dashed rounded-lg px-4 py-3 hover:border-blue-500 hover:bg-blue-50 transition-colors mb-3 ${
                errors.sizes ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <span className="text-gray-500">+ Nhấn để chọn kích cỡ</span>
            </button>
            {errors.sizes && (
              <span className="text-red-500 text-sm block mb-2">{errors.sizes.message}</span>
            )}

            <div className="flex flex-wrap gap-2">
              {sizes.map((size, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-sm">
                  <span>{size}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(index)}
                    className="font-bold text-red-500"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {showPopupSize && (
            <div className="fixed inset-0 left-[150px] bottom-[-200px] flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4">Chọn kích cỡ</h3>

                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={handleSelectAllSizes}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Chọn tất cả
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAllSizes}
                    className="bg-gray-400 text-white px-3 py-1 rounded text-sm"
                  >
                    Bỏ chọn tất cả
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {availableSizes.map((size) => {
                    const isSelected = tempSelectedSizes.some(s => s === size)
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleToggleSize(size)}
                        className={`py-3 px-4 rounded-lg font-medium transition-all ${
                          isSelected
                            ? 'bg-blue-500 text-white cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600'
                        }`}
                      >
                        {size}
                        {isSelected && <span className="ml-1">✓</span>}
                      </button>
                    )
                  })}
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={handleClosePopupSize}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSelectionSizes}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Xong
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label>Trạng thái <span className="text-red-500">*</span></label>
            <div className="flex items-center justify-start gap-[10px] text-[16px]">
              <div className="flex gap-[5px]">
                <input
                  {...register('status')}
                  type="radio"
                  className="border rounded-[5px] border-[#192335]"
                  id="statusActive"
                  value={'ACTIVE'}
                />
                <label htmlFor="statusActive">Hoạt động</label>
              </div>

              <div className="flex gap-[5px]">
                <input
                  {...register('status')}
                  type="radio"
                  className="border rounded-[5px] border-[#192335]"
                  id="statusInActive"
                  value={'INACTIVE'}
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
              to="/admin/products"
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

export default EditProduct