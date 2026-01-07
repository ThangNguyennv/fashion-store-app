import cron from "node-cron"
import Order from "../models/order.model"

// Hủy đơn hàng PENDING quá 15 phút 
// 5p quét 1 lần
cron.schedule("*/5 * * * *", async () => {
  try {
    const timeoutMinutes = 15
    const now = new Date()
    const expiredAt = new Date(now.getTime() - timeoutMinutes * 60000)

    const result = await Order.updateMany(
      {
        "paymentInfo.status": "PENDING",
        "paymentInfo.method": { $ne: "COD" },
        createdAt: { $lt: expiredAt },
      },
      {
        $set: { "paymentInfo.status": "FAILED" },
      }
    )

    if (result.modifiedCount > 0) {
      console.log(`Đã hủy ${result.modifiedCount} đơn PENDING quá hạn`)
    }
  } catch (error) {
    console.error("Lỗi khi auto-cancel order:", error)
  }
})
