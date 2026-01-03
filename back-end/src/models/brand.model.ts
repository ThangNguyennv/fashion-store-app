import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
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
    ]
  },
  {
    timestamps: true
  }
)

const Brand = mongoose.model('Brand', brandSchema, 'brands')

export default Brand
