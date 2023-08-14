import Filter from 'bad-words';

import {
  getProduct,
  getReviews,
  addReview,
  removeReview,
} from '../../models/product/product.model.js';
import { getPagination } from '../../utils/query.js';

async function httpsGetProduct(req, res) {
  const { id } = req.params;

  if (!id || id.length !== 24)
    return res.status(400).json({ message: 'invalid product id' });

  const { status, product, message } = await getProduct(id);
  res.status(status).json({ product, message });
}

async function httpsGetReviews(req, res) {
  const { id } = req.params;

  if (!id || id.length !== 24)
    return res.status(400).json({ message: 'invalid product id' });

  req.query.limit = req.query.limit || 3;

  if (req.query.limit > 50)
    return res.status(400).json({ message: "reviews can't exceed 50" });

  const { skip, limit, page } = getPagination(req.query);

  const { status, pagination, rating, reviews, message } = await getReviews(
    id,
    skip,
    limit,
    page
  );
  res.status(status).json({ pagination, rating, reviews, message });
}

async function httpsAddReview(req, res) {
  const { id } = req.params;

  if (!id || id.length !== 24)
    return res.status(400).json({ message: 'invalid product id' });

  if (!req.user.verified)
    return res
      .status(401)
      .json({ message: 'you must verify your account first' });

  let { score, title, content, customFields } = req.body;

  if (!(score && title && content && customFields))
    return res.status(400).json({ message: 'some fields are empty' });

  if (!(score === Number.parseInt(score) && score >= 1 && score <= 5))
    return res.status(400).json({ message: 'invalid rating' });

  const filter = new Filter();
  req.body.title = filter.clean(title);
  req.body.content = filter.clean(content);

  const { status, pagination, rating, reviews, message } = await addReview(
    id,
    req.body,
    req.user
  );
  res.status(status).json({ pagination, rating, reviews, message });
}

async function httpsRemoveReview(req, res) {
  const { id, reviewId } = req.params;

  if (!id || id.length !== 24)
    return res.status(400).json({ message: 'invalid product id' });

  if (!reviewId || reviewId.length !== 24)
    return res.status(400).json({ message: 'invalid review id' });

  const { status, reviews, message } = await removeReview(
    id,
    reviewId,
    req.user._id
  );
  res.status(status).json({ reviews, message });
}

export { httpsGetProduct, httpsGetReviews, httpsAddReview, httpsRemoveReview };
