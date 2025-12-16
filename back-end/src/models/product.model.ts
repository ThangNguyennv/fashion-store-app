import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const commentSchema = new mongoose.Schema({
    user_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User'
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
    images: [String],
    color:  String , // Tên màu, ví dụ: "Xanh Navy"
    size:  String   // Kích cỡ, ví dụ: "XL"
  }, 
  {
    timestamps: true
  }
)

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    product_category_id: {
      type: String,
      default: ''
    },
    description: String,
    price: {
      type: Number, 
      default: 0
    },
    discountPercentage: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      default: 0
    },
    selled: Number,
    colors: [
      {
        name: { type: String, required: true }, // Ví dụ: "Xanh Navy"
        code: { type: String, required: true },  // Ví dụ: "#000080"
        images: [String] 
      }
    ],
    sizes: [String], // Ví dụ: ["S", "M", "L", "XL"]
    stars: {
      average: { type: Number, default: 0 }, // Điểm trung bình, ví dụ: 4.5
      count: { type: Number, default: 0 }     // Tổng số lượt đánh giá, ví dụ: 150
    },
    comments: [commentSchema],
    thumbnail: String,
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    featured: {
      type: String,
      default: '1'
    },
    slug: {
      type: String,
      slug: 'title', 
      unique: true 
    },
    deleted: {
      type: Boolean,
      default: false
    },
    createdBy: {
      account_id: String,
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date
      }
    ],
    recoveredAt: Date
  },
  {
    timestamps: true
  }
)

// ===== INDEXES =====
productSchema.index({ title: 1, deleted: 1 })
productSchema.index({ deleted: 1, status: 1, createdAt: -1 })

const Product = mongoose.model('Product', productSchema, 'products')

export default Product
