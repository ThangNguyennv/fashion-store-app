
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import useCreate from '~/hooks/admin/brand/useCreate'

const CreateBrand = () => {
  const {
    setTitle,
    setStatus,
    preview,
    handleFileChange,
    handleSubmit,
    title,
    navigate
  } = useCreate()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tạo mới Thương hiệu</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md">
        <TextField
          label="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          fullWidth
          required
        />
        <FormControl fullWidth>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={status}
            label="Trạng thái"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value={'ACTIVE'}>Hoạt động</MenuItem>
            <MenuItem value={'INACTIVE'}>Không hoạt động</MenuItem>
          </Select>
        </FormControl>
        <div>
          <Button variant="contained" component="label">
            Chọn Logo
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          {preview && <img src={preview} alt="Logo preview" className="w-32 h-32 object-contain mt-4 border" />}
        </div>
        <div className="flex gap-4">
          <Button type="submit" variant="contained" color="primary">Tạo mới</Button>
          <Button variant="outlined" onClick={() => navigate('/admin/brands')}>Hủy</Button>
        </div>
      </form>
    </div>
  )
}

export default CreateBrand
