export const API_ROOT = import.meta.env.VITE_API_ROOT
export const API_KEY = import.meta.env.VITE_TINYMCE_API_KEY

export const ORDER_STATUSES_CHANGEMULTI = [
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'TRANSPORTING', label: 'Đang vận chuyển' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'CANCELED', label: 'Đã hủy' },
  { value: 'DELETEALL', label: 'Xóa tất cả' }
]

export const MYORDER_STATUSES = [
  { value: '', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'TRANSPORTING', label: 'Đang vận chuyển' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'CANCELED', label: 'Đã hủy' }
]


export const ORDERTRASH_STATUSES_CHANGEMULTI = [
  { value: 'RECOVER', label: 'Khôi phục' },
  { value: 'DELETEALL', label: 'Xóa vĩnh viễn' }
]

export const PRODUCTCATEGORY_STATUSES_CHANGEMULTI = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Ngừng hoạt động' },
  { value: 'DELETEALL', label: 'Xóa tất cả' }
]

export const PRODUCTCATEGORYTRASH_STATUSES_CHANGEMULTI = [
  { value: 'RECOVER', label: 'Khôi phục' },
  { value: 'DELETEALL', label: 'Xóa vĩnh viễn' }
]

export const PRODUCT_STATUSES_CHANGEMULTI = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Ngừng hoạt động' },
  { value: 'DELETEALL', label: 'Xóa tất cả' }
]

export const PRODUCTTRASH_STATUSES_CHANGEMULTI = [
  { value: 'RECOVER', label: 'Khôi phục' },
  { value: 'DELETEALL', label: 'Xóa vĩnh viễn' }
]

export const ARTICLECATEGORY_STATUSES_CHANGEMULTI = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Ngừng hoạt động' },
  { value: 'DELETEALL', label: 'Xóa tất cả' }
]

export const ARTICLE_STATUSES_CHANGEMULTI = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Ngừng hoạt động' },
  { value: 'DELETEALL', label: 'Xóa tất cả' }
]

export const availableSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']

export const availableColors = [
  { code: '#000000', name: 'Đen' },

  { code: '#BC3433', name: 'Đỏ' },
  { code: '#750B0E', name: 'Đỏ đậm' },

  { code: '#E766C3', name: 'Hồng' },
  { code: '#F4C7CD', name: 'Hồng nhạt' },

  { code: '#FB9D3B', name: 'Cam' },

  { code: '#D4E114', name: 'Vàng' },

  { code: '#01ADEF', name: 'Xanh nước' },
  { code: '#18BA2A', name: 'Xanh lục' },
  { code: '#355F3B', name: 'xanh rêu' },
  { code: '#06223F', name: 'Xanh đen' },
  { code: '#213059', name: 'Xanh navy' },

  { code: '#5D1F1F', name: 'Nâu' },

  { code: '#B88985', name: 'Be nâu' },
  { code: '#DDDDDD', name: 'Be trắng' },

  { code: '#FFFFFF', name: 'Trắng' },

  { code: '#525252', name: 'Xám đậm' },
  { code: '#B7B8BA', name: 'Xám nhạt' },
  { code: '#FFFDD1', name: 'Kem' },
  { code: '#9C9C9C', name: 'Ghi' },
  { code: '#ED08F8', name: 'Tím' }
]

export const sortOptions = [
  { name: 'Mặc định (Nổi bật)', key: 'position', value: 'desc' },
  { name: 'Giá: Cao đến Thấp', key: 'discountedPrice', value: 'desc' },
  { name: 'Giá: Thấp đến Cao', key: 'discountedPrice', value: 'asc' },
  { name: 'Tên: A-Z', key: 'title', value: 'asc' },
  { name: 'Tên: Z-A', key: 'title', value: 'desc' }
]