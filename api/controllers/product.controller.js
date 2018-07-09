const config = require('config'),
      path = require('path'),
      fs = require('fs'),
      express = require('express'),
      router = express.Router(),
      User = require('../models/user'),
      Product = require('../models/product'),
      Category = require('../models/category'),
      { productValidation } = require('../helpers/validation'),
      errorMsg = require('../helpers/error-msg'),
      resHandler = require('../helpers/res-handler');

// get All products
const listProducts = (req, res) => {
	const { pageNum, limit, filter, searchKey } = req.body;
	
	let query = {}  // query option for filtering and searching
	let skip = (pageNum - 1) * limit; 
	
	if (filter) {
		Object.assign(query, {"category.name": filter})
	}
	
	if (searchKey) {
		query.name = {
			$regex: `.*${searchKey}.*`
		};
	}

	Product.find(query, { _id: false, __v: false }).skip(skip).limit(limit).exec()
		.then(products => resHandler(res, config.success, false, null, null, products))
		.catch(err => resHandler(res, config.failed, true, err.message));
}

// create product
const createProduct = (req, res) => {
	const { name, price, description, categoryName } = req.body;
	let imageUrl, category;

	Product.findOne({ name })
		.then(product => {
			if (product)
				return Promise.reject(new Error(errorMsg.duplicateProduct));
			
			return Category.findOne({ name: categoryName }).select('_id, name').exec()
		})
		.then(cate => {
			if (cate) {
				category = cate;
				let dir = path.join(config.uploadPath, 'productImage/');
			
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir);
				}

				let file = req.files ? req.files.productImage : '';
				if (file) {
					imageUrl = name + '-' + new Date().getTime() + path.extname(file.name);

					return file.mv(dir + '/' + imageUrl);
				}
				imageUrl = ''; // static path of default image
				return Promise.resolve();
			}

			return Promise.reject(new Error('Invalid Category'));
		})
		.then(() => {
			const newProduct = new Product({ name, imageUrl, price, description, category });

			return newProduct.save();
		})
		.then(data => resHandler(res, config.success, false, null, null, 'Success'))
		.catch(err => resHandler(res, config.failed, true, err.message));
}

router.post('/', listProducts);
router.post('/create', createProduct);

module.exports = router;
