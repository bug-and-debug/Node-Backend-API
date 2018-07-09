const config = require('config'),
      express = require('express'),
      router = express.Router(),
      User = require('../models/user'),
      auth = require('../helpers/auth-helper'),
      { signupValidation, signinValidation } = require('../helpers/validation'),
      errorMsg = require('../helpers/error-msg'),
      resHandler = require('../helpers/res-handler');

// user register
const signUp = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(result => {
      if (result)
        return resHandler(res, config.failed, true, errorMsg.duplicateUser);
      else {
        const newUser = new User(req.body);
        return newUser.save();
      }
    })
    .then(user => {
      if (user) {
        return resHandler(res, config.success, false, null, null, 'success');
      }
    })
    .catch(err => resHandler(res, config.failed, true, errorMsg.db));
};

// user login
const signIn = (req, res) => {
  const payload = {
    email: req.body.email
  }

  User.findOne(payload)
    .then(result => {
      if (result.checkPassword(req.body.password)) {
        const token = auth.generateToken({_id: result._id});

        return resHandler(res, config.success, false, null, null, { token: token });
      } else {
        return resHandler(res, config.failed, true, errorMsg.dismatch);
      }
    })
    .catch(err => resHandler(res, config.failed, true, errorMsg.dismatch))
}


// routes
router.post('/', signupValidation(), signUp);
router.post('/login', signinValidation(), signIn);

module.exports = router;
