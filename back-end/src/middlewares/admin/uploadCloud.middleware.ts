import { Request, Response, NextFunction } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'

cloudinary.config({
 cloud_name: process.env.CLOUD_NAME,
 api_key: process.env.CLOUD_KEY,
 api_secret: process.env.CLOUD_SECRET
})

export const uploadWithOneImageToCloud = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.file) {
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result)
          } else {
            reject(error)
          }
        })
        streamifier.createReadStream(req.file.buffer).pipe(stream)
      })
    }
    async function upload(req) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await streamUpload(req)
      req.body[req.file.fieldname] = result.secure_url
      next()
    }
    upload(req)
  } else {
    next()
  }
}

// Helper function để upload một file buffer
const streamUpload = (fileBuffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result)
      } else {
        reject(error)
      }
    })
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

export const uploadCloud = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // req.files bây giờ là một mảng: Express.Multer.File[]
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const files = req.files as Express.Multer.File[]
      
      const uploadPromises = files.map(file => streamUpload(file.buffer))
      const results = await Promise.all(uploadPromises)

      // KHÔNG gán trực tiếp vào req.body nữa
      // Thay vào đó, chúng ta lưu mảng URL vào một thuộc tính tạm trên `req`
      req['fileUrls'] = results.map(result => result.secure_url)
    }
    next()
  } catch (error) {
    console.error("Lỗi khi upload lên Cloudinary:", error)
    next(error)
  }
}
export default uploadCloud
