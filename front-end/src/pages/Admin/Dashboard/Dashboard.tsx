import { useDashboard } from '~/hooks/Admin/Dashboard/useDashboard'
import { FaProductHunt } from 'react-icons/fa'
import { PiUserListBold } from 'react-icons/pi'
import { RiBillLine } from 'react-icons/ri'
import { MdCheckCircleOutline } from 'react-icons/md'
import { Line } from 'react-chartjs-2'
import { Bar } from 'react-chartjs-2'
import { Doughnut } from 'react-chartjs-2'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartData
} from 'chart.js'

// đăng ký bắt buộc
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Dashboard = () => {
  const currentMonth = new Date().getMonth() + 1
  const {
    statistic,
    chartData
  } = useDashboard()

  if (!chartData) return <p>Đang tải...</p>

  return (
    <>
      <div className='flex flex-col gap-[20px] bg-[#FFFFFF] px-[30px] py-[30px] shadow-md'>
        <h1 className="text-[30px] font-[700] text-[#BC3433]">Thống kê</h1>

        <div className='grid grid-cols-4 gap-[10px] p-[5px] text-amber-50'>
          <div className='border rounded-[5px] p-[15px] gap-[25px] flex items-center justify-center bg-[#FFAB19]'>
            <MdCheckCircleOutline className='text-[30px]'/>
            <div className='flex flex-col gap-[5px]'>
              <b>Doanh thu tháng {currentMonth}</b>
              <b>{statistic.revenue.total.toLocaleString('vi-VN')}đ</b>
            </div>
          </div>
          <div className='border rounded-[5px] p-[15px] gap-[25px] flex items-center justify-center bg-[#18BA2A]'>
            <RiBillLine className='text-[30px]'/>
            <div className='flex flex-col gap-[5px]'>
              <b>Đơn hàng</b>
              <b>{statistic.order.total}</b>
            </div>
          </div>
          <div className='border rounded-[5px] p-[15px] gap-[25px] flex items-center justify-center bg-[#525FE1]'>
            <FaProductHunt className='text-[30px]'/>
            <div className='flex flex-col gap-[5px]'>
              <b>Sản phẩm</b>
              <b>{statistic.product.total}</b>
            </div>
          </div>
          <div className='border rounded-[5px] p-[15px] gap-[25px] flex items-center justify-center bg-[#2F57EF]'>
            <PiUserListBold className='text-[30px]'/>
            <div className='flex flex-col gap-[5px]'>
              <b>Lượng truy cập</b>
              <b>{statistic.user.total}</b>
            </div>
          </div>
        </div>

        {chartData && (
          <div className='grid grid-cols-2 gap-[15px]'>
            <div className='w-[700px] h-[500px]'>
              <Line
                data={chartData as ChartData<'line'>}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' as const },
                    title: { display: true, text: 'Biểu đồ doanh thu theo tháng' }
                  }
                }}
              />
            </div>
            <div className='w-[700px] h-[500px]'>
              <Bar
                data={chartData as ChartData<'bar'>}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' as const },
                    title: { display: true, text: 'Biểu đồ doanh thu theo tháng' }
                  }
                }}
              />
            </div>
            <div className='w-[600px] h-[500px]'>
              <Doughnut
                data={chartData as ChartData<'doughnut'>}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' as const },
                    title: { display: true, text: 'Tỉ lệ doanh thu theo trạng thái đơn hàng' }
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Dashboard