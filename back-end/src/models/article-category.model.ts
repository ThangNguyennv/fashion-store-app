import mongoose from 'mongoose'

import slug from 'mongoose-slug-updater'
mongoose.plugin(slug)

const articleCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    parent_id: {
      type: String,
      default: ''
    },
    descriptionShort: String,
    descriptionDetail: String,
    thumbnail: String,
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE'
    },
    slug: {
      type: String,
      slug: 'title', // <-> San-pham-1
      unique: true // slug duy nhất
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

articleCategorySchema.index({ title: 1, deleted: 1 })
articleCategorySchema.index({ deleted: 1, status: 1, createdAt: -1 })

const ArticleCategory = mongoose.model(
  'ArticleCategory',
  articleCategorySchema,
  'articles-category'
)

export default ArticleCategory
