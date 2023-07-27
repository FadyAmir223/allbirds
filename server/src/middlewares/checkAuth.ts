function checkLoggedIn(req, res, next) {
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn)
    return res.status(401).json({ message: 'you must login first' });
  next();
}

function checkLoggedOut(req, res, next) {
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (isLoggedIn)
    return res.status(401).json({ message: 'you must logout first' });
  next();
}

function checkPermissions(req, res, next) {
  const isAuthenticated = true;
  if (!isAuthenticated)
    return res.status(403).json({ message: 'access denied' });
  next();
}

export { checkLoggedIn, checkLoggedOut, checkPermissions };
