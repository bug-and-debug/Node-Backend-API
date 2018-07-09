const auth = require('../helpers/auth-helper');

module.exports = app => {
  app.use('/api/v1/user', require('../controllers/user.controller'));
  app.use('/api/v1/category', auth.checkAuth(), require('../controllers/category.controller'));
  app.use('/api/v1/product', auth.checkAuth(), require('../controllers/product.controller'));
  app.use('/api/v1/order', auth.checkAuth(), require('../controllers/order.controller'));
};
