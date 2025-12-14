/* eslint-disable no-unused-vars */
import Skeleton from '@mui/material/Skeleton'
import { useMemo } from 'react'
import type { FilterStatusInterface } from '~/types/helper.type'
import type { OrderStatus } from '~/types/order.type'

interface Props {
  filterOrder: FilterStatusInterface[]
  currentStatus: OrderStatus
  handleFilterStatus: (status: OrderStatus) => void
  items: { status: string }[],
}

const FilterStatusOrder = ({ filterOrder, currentStatus, handleFilterStatus, items }: Props) => {
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    counts[''] = items.length
    return counts
  }, [items])

  return (
    <>
      {filterOrder && filterOrder.length > 0 ? (
        <div className='flex gap-[15px] items-center'>
          {filterOrder.map((item, index) => {
            const isActive = currentStatus === item.status
            const count = statusCounts[item.status] || 0
            return (
              <button
                key={index}
                onClick={() => handleFilterStatus(item.status as OrderStatus)}
                className={`p-[5px] border rounded-[5px] border-[#525FE1] hover:bg-[#525FE1] 
                  ${isActive ? 'bg-[#525FE1] border-[#525FE1]' : 'bg-white'}`}
              >
                <span>{item.name} ({count})</span>
              </button>
            )
          })}
        </div>
      ) : (
        <div className='flex gap-[15px] items-center'>
          <Skeleton variant="rectangular" width={55} height={35} sx={{ bgcolor: 'grey.400', borderRadius: 2 }}/>
          <Skeleton variant="rectangular" width={74} height={35} sx={{ bgcolor: 'grey.400', borderRadius: 2 }}/>
          <Skeleton variant="rectangular" width={122} height={35} sx={{ bgcolor: 'grey.400', borderRadius: 2 }}/>
          <Skeleton variant="rectangular" width={55} height={35} sx={{ bgcolor: 'grey.400', borderRadius: 2 }}/>
          <Skeleton variant="rectangular" width={74} height={35} sx={{ bgcolor: 'grey.400', borderRadius: 2 }}/>
          <Skeleton variant="rectangular" width={74} height={35} sx={{ bgcolor: 'grey.400', borderRadius: 2 }}/>
        </div>
      )}
    </>
  )
}

export default FilterStatusOrder