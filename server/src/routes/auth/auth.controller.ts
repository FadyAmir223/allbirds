async function htppsLogout(req, res) {
  req.logout((err) => {
    if (err)
      return res
        .status(500)
        .json({ logout: false, message: 'error during logout' });

    res.status(200).json({ logout: true });
  });
}

export { htppsLogout };
