import { Clock, Sparkles } from 'lucide-react'
import useAdminWelcome from '~/hooks/Admin/adminWelcome/useAdminWelcome'

export default function AdminWelcome() {
  const {
    Bell,
    Target,
    currentTime,
    greeting,
    quickAccess,
    systemStatus,
    announcements,
    currentTip,
    tips
  } = useAdminWelcome()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 text-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {greeting}! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Chào mừng bạn đến với trang quản trị
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {currentTime.toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} • {currentTime.toLocaleTimeString('vi-VN')}
            </p>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickAccess.map((item, index) => (
            <button
              key={index}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all hover:scale-105 text-left group shadow-md hover:shadow-xl"
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-1 text-gray-900">{item.label}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Announcements */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
              <Bell className="w-6 h-6 text-blue-600" />
              Thông báo & Cập nhật
            </h2>
            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-all cursor-pointer group border border-gray-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                      <announcement.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-semibold mb-1">{announcement.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{announcement.message}</p>
                      <p className="text-gray-500 text-xs">{announcement.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
              <Target className="w-6 h-6 text-green-600" />
              Trạng thái hệ thống
            </h2>
            <div className="space-y-4">
              {systemStatus.map((status, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 text-sm">{status.label}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${status.color} animate-pulse`}></div>
                      <span className="text-gray-600 text-sm">{status.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-white">✓ Tất cả dịch vụ hoạt động tốt</p>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 flex items-center gap-4 shadow-lg">
          <div className="p-3 bg-white bg-opacity-20 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-100 mb-1">Mẹo hữu ích</p>
            <p className="font-semibold text-white">{tips[currentTip]}</p>
          </div>
        </div>
      </div>
    </div>
  )
}