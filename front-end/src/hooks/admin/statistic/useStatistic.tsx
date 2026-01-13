import { useEffect, useState } from 'react'
import { fetchStatisticAPI } from '~/apis/admin/statistic.api'
import type { StatisticInterface } from '~/interfaces/statistic.interface'
import type { ChartData } from 'chart.js'
import { useAuth } from '~/contexts/admin/AuthContext'

type AnyChartData =
  | ChartData<'line'>
  | ChartData<'bar'>
  | ChartData<'doughnut'>

export const useStatistic = () => {
  const [statistic, setStatistic] = useState({
    user: {
      total: 0
    },
    product: {
      total: 0
    },
    order: {
      total: 0
    },
    revenue: {
      total: 0
    }
  })
  const [chartData, setChartData] = useState<AnyChartData>({
    labels: [],
    datasets: []
  })
  const { role } = useAuth()

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res: StatisticInterface = await fetchStatisticAPI()
        setStatistic(res.statistic)
        if (res && res.labels && res.data) {
          setChartData({
            labels: res.labels,
            datasets: [
              {
                label: 'Doanh thu theo tháng (VND)',
                data: res.data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.3, // làm đường cong mềm mại
                fill: true // tô màu dưới đường
              }
            ]
          })
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Fetch revenue failed', error)
      }
    }
    fetchRevenue()
  }, [])

  return {
    statistic,
    chartData,
    role
  }
}