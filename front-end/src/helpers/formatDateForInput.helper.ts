// Hàm để định dạng ngày tháng cho input
export const formatDateForInput = (dateString: string | Date | undefined) => {
  if (!dateString) return ''
  // Chuyển đổi về định dạng YYYY-MM-DD
  return new Date(dateString).toISOString().split('T')[0]
}