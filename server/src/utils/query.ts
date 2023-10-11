const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 0;
const DEFAUTL_PAGE = 1;

const getPagination = (query) => {
  const page = +query.page || DEFAUTL_PAGE;
  const limit = +query.limit || DEFAULT_LIMIT;
  const skip = (page - 1) * limit || DEFAULT_SKIP;
  return { skip, limit, page };
};

export { getPagination };
