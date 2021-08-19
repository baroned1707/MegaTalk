const handleTest = (req, res, next) => {
  console.log(req.user);
  res.send({
    status: true,
  });
};

module.exports = {
  handleTest,
};
