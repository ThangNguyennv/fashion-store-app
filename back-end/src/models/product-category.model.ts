import mongoose from 'mongoose'

import slug from 'mongoose-slug-updater'
mongoose.plugin(slug)

const productCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    parent_id: {
      type: String,
      default: ''
    },
    description: String,
    thumbnail: String,
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE'
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

// INDEXES
productCategorySchema.index({ title: 1, deleted: 1 })
productCategorySchema.index({ deleted: 1, status: 1, createdAt: -1 })


const ProductCategory = mongoose.model(
  'ProductCategory',
  productCategorySchema,
  'products-category'
)

export default ProductCategory
