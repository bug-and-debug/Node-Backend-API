const config = require('config'),
      express = require('express'),
      router = express.Router(),
      User = require('../models/user'),
      Category = require('../models/category'),
      { categoryValidation } = require('../helpers/validation'),
      errorMsg = require('../helpers/error-msg'),
      resHandler = require('../helpers/res-handler');

const createCategory = (req, res) => {
    const decoded = req.token;
    const name = req.body.name;

    User.findById({_id: decoded._id})
        .then(user => {
            if (user && user.role == 1) // only admin can create new category
                return Category.findOne({ name })

            return Promise.reject(new Error(errorMsg.invalidRole));
        })
        .then(category => {
            if (category)
                return Promise.reject(new Error(errorMsg.duplicateCategory));
            
            const newCate = new Category({ name });
            return newCate.save();
        })
        .then(data => resHandler(res, config.success, false, null, null, 'Success'))
        .catch(err => resHandler(res, config.failed, true, err.message))
}

router.post('/create', categoryValidation(), createCategory);

module.exports = router;
