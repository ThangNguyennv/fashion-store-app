import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true
    },
    cart_id: String,
    userInfo: {
      fullName: String,
      phone: String,
      address: String
    },
    amount: {
      type: Number,
      required: true
    },
    note: String,
    estimatedDeliveryDay: String,
    estimatedConfirmedDay: String, 
    paymentInfo: {
      method: {
        type: String,
        enum: ['COD', 'VNPAY', 'MOMO', 'ZALOPAY'],
      },
      status: { 
        type: String, 
        enum: ['PENDING', 'PAID', 'FAILED'], 
        default: 'PENDING' 
      },
      details: { 
        type: mongoose.Schema.Types.Mixed, 
        default: {} 
      }
    },
    products: [
      {
        product_id: String,
        title: String,
        price: Number,
        quantity: Number,
        discountPercentage: Number,
        thumbnail: String,
        color: String,
        size: String,
      }
    ],
    status: {
      type: String,
      enum: ['PENDING', 'TRANSPORTING', 'CONFIRMED', 'CANCELED'],
      default: 'PENDING'
    },
    deleted: {
      type: Boolean,
      default: false
    },
    createdBy: {
      account_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Account'
      }
    },
    updatedBy: [
      {
        account_id: {
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Account'
        },
        updatedAt: Date
      }
    ],
    deletedBy: {
      account_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Account'
      },
      deletedAt: Date
    },
    recoveredAt: Date
  },
  {
    timestamps: true
  }
)

// INDEXES
orderSchema.index({ deleted: 1, status: 1, createdAt: -1 })
orderSchema.index({ deleted: 1, status: 1, amount: -1 })
orderSchema.index({ 'userInfo.phone': 1, deleted: 1 })


const Order = mongoose.model('Order', orderSchema, 'orders')

export default Order
