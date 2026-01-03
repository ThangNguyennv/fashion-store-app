/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material'
import useEdit from '~/hooks/Admin/brand/useEdit'

const EditBrand = () => {
  const {
    loading,
    preview,
    handleFileChange,
    handleChange,
    handleSubmit,
    brand,
    navigate
  } = useEdit()

  if (loading) return <div className="p-6 flex justify-center"><CircularProgress /></div>
  if (!brand) return <div className="p-6">Không tìm thấy thương hiệu.</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa Thương hiệu</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md">
        <TextField
          label="Tiêu đề"
          name="title"
          value={brand.title}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          required
        />
        <FormControl fullWidth>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            name="status"
            value={brand.status}
            label="Trạng thái"
            onChange={handleChange as any}
          >
            <MenuItem value={'ACTIVE'}>Hoạt động</MenuItem>
            <MenuItem value={'INACTIVE'}>Không hoạt động</MenuItem>
          </Select>
        </FormControl>
        <div>
          <Button variant="contained" component="label">
            Đổi Logo
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          {preview && <img src={preview} alt="Logo preview" className="w-32 h-32 object-contain mt-4 border" />}
        </div>
        <div className="flex gap-4">
          <Button type="submit" variant="contained" color="primary">Cập nhật</Button>
          <Button variant="outlined" onClick={() => navigate('/admin/brands')}>Hủy</Button>
        </div>
      </form>
    </div>
  )
}

export default EditBrand
