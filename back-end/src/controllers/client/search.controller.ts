import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as searchService from '~/services/client/search.service'


// [GET] /search
export const index = async (req: Request, res: Response) => {
  try {
    const { objectSearch, newProducts } = await searchService.getSearch(req.query.keyword)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      keyword: objectSearch.keyword,
      products: newProducts
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
