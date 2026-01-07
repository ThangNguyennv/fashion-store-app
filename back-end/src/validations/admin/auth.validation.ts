import { Request, Response, NextFunction } from 'express'

export const loginPost = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body.email) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập email!'
    })
    return
  }

  if (!req.body.password) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập mật khẩu!'
    })
    return
  }
  next()
}
