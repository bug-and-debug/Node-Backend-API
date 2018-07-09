const config = require('config'),
      path = require('path'),
      fs = require('fs'),
      express = require('express'),
      router = express.Router(),
      User = require('../models/user'),
      Product = require('../models/product'),
      Order = require('../models/order'),
      { productValidation } = require('../helpers/validation'),
      errorMsg = require('../helpers/error-msg'),
      resHandler = require('../helpers/res-handler'),
      sendEmail = require('../helpers/email');

// get all orders for only admin
const listOrders = (req, res) => {
    const decoded = req.token;

    User.findById({ _id: decoded._id }, { __v: false, _id: false, salt: false, hashedPassword: false, created: false })
        .then(user => {
            if (user && user.role === 1) { // check if user is admin or not.
                return Order.find({}, { __v: false, _id: false })
            }

            return Promise.reject(new Error('No Admin'));
        })
        .then(products => {
            resHandler(res, config.success, false, null, null, products)
        })
		.catch(err => resHandler(res, config.failed, true, err.message));
}

const createOrder = (req, res) => {
    const decoded = req.token;
    let payload = {
        name: req.body.productName
    }
	let orderUser; // user who ordered the product.

    User.findById({ _id: decoded._id }, { __v: false, _id: false, salt: false, hashedPassword: false, created: false })
        .then(user => {
            if (user) {
                orderUser = user;
                return Product.findOne(payload, { __v: false, _id: false })
            }

            return Promise.reject(new Error(errorMsg.unauthorized));
        })
        .then(product => {
            if (product) {
                const newOrder = new Order({ product, user: orderUser });
                return newOrder.save();
            }

            return Promise.reject(new Error('Invalid Product'));
        })
        .then(data => {
            let params = {
                to: data.user.email,
                from: config.mailgun.mailSender,
                subject: 'New Order',
                text: 'Please have a look!',
                html: `Hi, ${data.user.firstName}!
                        You have bought a ${data.product.name} for $ ${data.product.price}`
            }

            return sendEmail(params);
        })
        .then(data=> resHandler(res, config.success, false, null, null, 'Success'))
        .catch(err => resHandler(res, config.failed, true, err.message));
}

router.get('/', listOrders);
router.post('/create', createOrder);

module.exports = router;
