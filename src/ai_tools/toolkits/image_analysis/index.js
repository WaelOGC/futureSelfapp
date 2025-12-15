// Image Analysis tool exports

const metadata = require('./metadata');
const { validate } = require('./validate');
const { handle } = require('./handler');

module.exports = {
  metadata,
  validate,
  handler: handle
};
