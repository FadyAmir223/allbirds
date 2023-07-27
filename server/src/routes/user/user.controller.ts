async function htppsGetSecret(req, res) {
  const { username } = req.user;
  return res.json({ username });
}

export { htppsGetSecret };
