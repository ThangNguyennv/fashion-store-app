import { Request, Response, NextFunction } from 'express'
import User from '~/models/user.model'
import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import { JWTProvider } from '~/providers/jwt.provider'

export const infoUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
   return
  
}
