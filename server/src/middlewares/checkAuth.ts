function isLoggedIn(req) {
  try {
    return req.isAuthenticated() && req.user;
  } catch {
    return false;
  }
}

function checkLoggedIn(req, res, next) {
  if (!isLoggedIn(req))
    return res.status(401).json({ message: 'you must login first' });
  next();
}

function checkLoggedOut(req, res, next) {
  if (isLoggedIn(req))
    return res.status(401).json({ message: 'you must logout first' });
  next();
}

function checkPermissions(req, res, next) {
  const isAuthenticated = req.user.role === 'admin';
  if (!isAuthenticated)
    return res.status(403).json({ message: 'access denied' });
  next();
}

function checkUserAgent(req, res, next) {
  const validUserAgents = req.user?.security?.userAgent || [];
  const userAgent = req.headers['user-agent'];

  if (!validUserAgents.includes(userAgent))
    return res.status(401).json({ message: 'unauthorized access' });

  next();
}

export { checkLoggedIn, checkLoggedOut, checkPermissions, checkUserAgent };
