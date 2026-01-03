import { useState, useEffect } from 'react'
import { BarChart3, FileText, Calendar, Bell, Settings, Clock, Sparkles, Zap, Target } from 'lucide-react'

const useAdminWelcome = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)

    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Chào buổi sáng')
    else if (hour < 18) setGreeting('Chào buổi chiều')
    else setGreeting('Chào buổi tối')

    return () => clearInterval(timer)
  }, [])

  const quickAccess = [
    { icon: FileText, label: 'Tài liệu', desc: 'Hướng dẫn & tài liệu', color: 'from-blue-500 to-blue-600' },
    { icon: Calendar, label: 'Lịch làm việc', desc: 'Xem lịch trình', color: 'from-green-500 to-green-600' },
    { icon: BarChart3, label: 'Báo cáo', desc: 'Xem báo cáo của bạn', color: 'from-purple-500 to-purple-600' },
    { icon: Settings, label: 'Cài đặt', desc: 'Tùy chỉnh hệ thống', color: 'from-orange-500 to-orange-600' }
  ]

  const systemStatus = [
    { label: 'Hệ thống hoạt động', status: 'Bình thường', color: 'bg-green-500' },
    { label: 'Máy chủ', status: 'Ổn định', color: 'bg-green-500' },
    { label: 'Cơ sở dữ liệu', status: 'Đang kết nối', color: 'bg-blue-500' }
  ]

  const announcements = [
    { title: 'Cập nhật hệ thống', message: 'Phiên bản mới đã được triển khai', time: '2 giờ trước', icon: Sparkles },
    { title: 'Bảo trì định kỳ', message: 'Bảo trì hệ thống vào 23:00 hôm nay', time: '1 ngày trước', icon: Clock },
    { title: 'Tính năng mới', message: 'Dashboard đã được cải thiện', time: '3 ngày trước', icon: Zap }
  ]

  const tips = [
    'Sử dụng phím tắt Ctrl+K để tìm kiếm nhanh',
    'Bạn có thể tùy chỉnh giao diện trong phần Cài đặt',
    'Nhấn F11 để vào chế độ toàn màn hình'
  ]

  const [currentTip, setCurrentTip] = useState(0)

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
    }, 5000)
    return () => clearInterval(tipTimer)
  }, [])
  return {
    Bell,
    Target,
    currentTime,
    greeting,
    quickAccess,
    systemStatus,
    announcements,
    currentTip,
    tips
  }
}

export default useAdminWelcome