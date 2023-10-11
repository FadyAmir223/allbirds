import { Request, Response } from 'express';

import {
  getProduct,
  getReviews,
  addReview,
  removeReview,
} from '../../models/product/product.model.js';
import { getPagination } from '../../utils/query.js';

async function httpsGetProduct(req: Request, res: Response) {
  const { handle } = req.params;

  const { status, product, message } = await getProduct(handle);
  res.status(status).json({ product, message });
}

async function httpsGetReviews(req: Request, res: Response): Promise<Response> {
  const { handle } = req.params;

  if (!req.query?.limit) req.query.limit = '3';

  if (+req.query.limit > 50)
    return res.status(400).json({ message: "reviews can't exceed 50" });

  const { skip, limit, page } = getPagination(req.query);

  const { status, pagination, rating, reviews, message } = await getReviews(
    handle,
    skip,
    limit,
    page
  );
  res.status(status).json({ pagination, rating, reviews, message });
}

async function httpsAddReview(req: Request, res: Response): Promise<Response> {
  const { handle } = req.params;

  if (!req.user.verified)
    return res
      .status(401)
      .json({ message: 'you must verify your account first' });

  const { score, title, content, customFields } = req.body;

  if (!(score && title && content && customFields))
    return res.status(400).json({ message: 'some fields are empty' });

  if (!(score === Number.parseInt(score) && score >= 1 && score <= 5))
    return res.status(400).json({ message: 'invalid rating' });

  const { status, pagination, rating, reviews, message } = await addReview(
    handle,
    req.body,
    req.user
  );
  res.status(status).json({ pagination, rating, reviews, message });
}

async function httpsRemoveReview(
  req: Request,
  res: Response
): Promise<Response> {
  const { handle, reviewId } = req.params;

  if (reviewId.length !== 24)
    return res.status(400).json({ message: 'invalid review id' });

  const { status, pagination, rating, reviews, message } = await removeReview(
    handle,
    reviewId,
    req.user._id
  );

  res.status(status).json({ pagination, rating, reviews, message });
}

export { httpsGetProduct, httpsGetReviews, httpsAddReview, httpsRemoveReview };
