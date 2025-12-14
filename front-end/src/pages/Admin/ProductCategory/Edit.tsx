import { Editor } from '@tinymce/tinymce-react'
import { API_KEY } from '~/utils/constants'
import { useEdit } from '~/hooks/Admin/ProductCategory/useEdit'
import SelectTree from '~/components/Admin/TableTree/SelectTreeProduct'
import { Link } from 'react-router-dom'

const EditProductCategory = () => {
  const {
    allProductCategories,
    productCategoryInfo,
    setProductCategoryInfo,
    uploadImageInputRef,
    uploadImagePreviewRef,
    handleChange,
    handleSubmit,
    handleClick,
    role
  } = useEdit()

  return (
    <>
      {role && role.permissions.includes('products-category_edit') && (
        productCategoryInfo && (
          <form
            onSubmit={(event) => handleSubmit(event)}
            className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md"
            encType="multipart/form-data"
          >
            <h1 className="text-[24px] font-[600] text-[#192335]">Chỉnh sửa danh mục sản phẩm</h1>
            <div className="form-group">
              <label htmlFor="title">Tiêu đề</label>
              <input
                onChange={(event) => setProductCategoryInfo(productCategoryInfo ? { ...productCategoryInfo, title: event.target.value } : productCategoryInfo)}
                type="text"
                id="title"
                name="title"
                className='py-[3px] text-[16px]'
                value={productCategoryInfo.title}
              />
            </div>

            <div className="form-group">
              <label htmlFor="parent_id">Danh mục</label>
              <select
                name="parent_id"
                id="parent_id"
                className="outline-none border rounded-[5px] border-[#00171F] py-[3px] text-[16px]"
                value={productCategoryInfo.parent_id}
                onChange={(event) => setProductCategoryInfo({ ...productCategoryInfo, parent_id: event.target.value })}
              >
                <option value={''}>-- Chọn danh mục --</option>
                {allProductCategories && allProductCategories.length > 0 && (
                  allProductCategories.map(productCategory => (
                    <SelectTree
                      key={productCategory._id}
                      productCategory={productCategory}
                      level={1}
                      allProductCategories={allProductCategories}
                      parent_id={productCategoryInfo.parent_id}
                    />
                  ))
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="desc">Mô tả</label>
              <Editor
                apiKey={API_KEY}
                init={{
                  plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
                }}
                value={productCategoryInfo.description}
                onEditorChange={(newValue) => setProductCategoryInfo(productCategoryInfo ? { ...productCategoryInfo, description: newValue }: productCategoryInfo)}
                id="desc"
              />
            </div>

            <div className="flex flex-col gap-[10px]">
              <label htmlFor="thumbnail">Ảnh</label>
              <input
                onChange={(event) => handleChange(event)}
                ref={uploadImageInputRef}
                type="file"
                id="thumbnail"
                name="thumbnail"
                className='hidden'
                accept="image/*"
              />
              <button
                onClick={event => handleClick(event)}
                className="bg-[#9D9995] font-[500] border rounded-[5px] w-[6%] py-[4px] text-[14px]"
              >
              Chọn ảnh
              </button>
              <img
                ref={uploadImagePreviewRef}
                src={productCategoryInfo.thumbnail}
                alt="Thumbnail preview"
                className="border rounded-[5px] w-[150px] h-[150px]"
              />
            </div>

            <div className="form-group">
              <label htmlFor="position">Vị trí</label>
              <input
                onChange={(event) => setProductCategoryInfo(productCategoryInfo ? { ...productCategoryInfo, position: Number(event.target.value) }: productCategoryInfo)}
                type="number"
                id="position"
                name="position"
                placeholder="Tự động tăng"
                min={1}
                className='text-[16px] py-[3px]'
                value={productCategoryInfo.position ? productCategoryInfo.position : ''}
              />
            </div>

            <div className="flex items-center justify-start gap-[10px] text-[16px]">
              <div className="flex gap-[5px]">
                <input
                  onChange={(event) => setProductCategoryInfo(productCategoryInfo ? { ...productCategoryInfo, status: event.target.value }: productCategoryInfo)}
                  type="radio"
                  className="border rounded-[5px] border-[#192335]"
                  id="statusActive"
                  name="status"
                  value={'active'}
                  checked={productCategoryInfo.status === 'active' ? true : false}
                />
                <label htmlFor="statusActive">Hoạt động</label>
              </div>

              <div className="flex gap-[5px]">
                <input
                  onChange={(event) => setProductCategoryInfo(productCategoryInfo ? { ...productCategoryInfo, status: event.target.value }: productCategoryInfo)}
                  type="radio"
                  className="border rounded-[5px] border-[#192335]"
                  id="statusInActive"
                  name="status"
                  value={'inactive'}
                  checked={productCategoryInfo.status === 'inactive' ? true : false}
                />
                <label htmlFor="statusInActive">Dừng hoạt động</label>
              </div>
            </div>
            <div className='flex items-center justify-start text-center gap-[5px]'>
              <Link
                to="/admin/products-category"
                className="w-[6%] border rounded-[5px] bg-[#525FE1] text-white p-[7px] text-[14px]"
              >
              Quay lại
              </Link>
              <button
                type="submit"
                className="w-[6%] border rounded-[5px] bg-[#525FE1] text-white p-[7px] text-[14px]"
              >
              Cập nhật
              </button>
            </div>
          </form>
        )
      )}
    </>
  )
}

export default EditProductCategory