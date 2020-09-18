'use strict';

module.exports = (err, req, res, next) => {
  let output = {
    ERROR: err,
  };

  res.status(500).json(output);
};