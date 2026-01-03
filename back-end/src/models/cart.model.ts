import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema(
  {
    user_id: String,
    products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product' // Tham chiếu đến model 'Product'
        },
        quantity: { type: Number, min: 1, default: 1 },
        color: String,
        size: String,
        totalPrice: Number
      }
    ],
    totalsPrice: Number
  },
  {
    timestamps: true
  }
)

const Cart = mongoose.model('Cart', cartSchema, 'carts')

export default Cart
