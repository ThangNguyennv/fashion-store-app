import { Request, Response, NextFunction } from 'express'

export const createBrand = (
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

export const editBrand = (
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