import { Request, Response, NextFunction } from 'express'

export const parseProductData = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.productData) {
    try {
      // Parse chuỗi JSON và gán lại cho req.body
      req.body = JSON.parse(req.body.productData)
    } catch (error) {
      return res.json({ 
        code: 400, 
        message: 'Dữ liệu productData không hợp lệ.' 
      })
    }
  }
  next()
}