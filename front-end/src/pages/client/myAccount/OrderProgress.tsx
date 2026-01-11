import React from 'react'

interface OrderStatusProps {
  currentStep: number; // 0 = PENDING, 1 = TRANSPORTING, 2 = CONFIRMED, 3 = CANCELED
}

const steps = ['PENDING', 'TRANSPORTING', 'CONFIRMED']

const OrderProgress: React.FC<OrderStatusProps> = ({ currentStep }) => {
  return (
    <div className="w-full px-4 py-2">
      {/* Thanh progress */}
      <div className="relative h-2 bg-gray-300 rounded-full mb-6">
        <div
          className="absolute h-2 bg-blue-500 rounded-full transition-all duration-500"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`
          }}
        />
      </div>

      {/* Các bước */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStep
          return (
            <div
              key={index}
              className="flex items-center justify-center gap-[5px] text-center text-sm"
            >
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  index == 0 && isCompleted ? 'bg-[#FFAB19] border-[#FFAB19]'
                    : index == 1 && isCompleted ? 'bg-[#2F57EF] border-[#2F57EF]'
                      : index == 2 && isCompleted ? 'bg-[#18BA2A] border-[#18BA2A]'
                        : index == 3 && isCompleted
                }`}
              />
              <span>
                {step === 'PENDING'
                  ? <span className='text-red-500'>Đang xử lý</span>
                  : step === 'TRANSPORTING' ? <span className='text-blue-500'>Đang vận chuyển</span>
                    : <span className='text-green-500'>Đã hoàn thành</span>
                }
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OrderProgress
