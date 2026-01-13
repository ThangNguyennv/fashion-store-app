export const formatDateIntl = (dateString: string | Date | undefined) => {
  if (!dateString) return ''

  const date = new Date(dateString)

  // Sử dụng API quốc tế hóa của trình duyệt
  // 'vi-VN' sẽ tự động định dạng theo kiểu Việt Nam (DD/MM/YYYY)
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  // formatter.format(date) sẽ trả về "DD/MM/YYYY"
  // Chúng ta chỉ cần thay thế dấu "/" bằng dấu "-"
  return formatter.format(date).replace(/\//g, '-')
}