import { Request, Response, NextFunction } from 'express'

// Middleware validate cho việc tạo mới
export const createPost = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body.title) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập tiêu đề!'
    })
    return
  }
  next()
}
