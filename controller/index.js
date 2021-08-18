const handleTest = (req, res, next) => {
  next(new Error(`${403}:${"Test write log server !"}`));
};

module.exports = {
  handleTest,
};
