const resHandler = require('./res-handler'),
      config = require('config'),
      errorMsg = require('./error-msg');

const emailRegex = /^[_A-Za-z0-9-]+(\.[_A-Za-z0-9-]+)*(\+[A-Za-z0-9-]+)?@[A-Za-z0-9-]+(\.[A-Za-z0-9-]{2,})*$/,
      nameRegex  = /^(?=[a-zA-Z-\s]{2,}$)^[a-zA-Z\s]+(-[a-zA-Z\s]+)*$/,
      phoneRegex = /^\d+$/,
      passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const signupValidation = () => {
  return (req, res, next) => {
    const { email, firstName, lastName, phoneNumber, password, role } = req.body;

    if (!firstName || !nameRegex.test(firstName) || !lastName || !nameRegex.test(lastName)) {
      return resHandler(res, config.failed, true, errorMsg.invalidName);
    }

    if (!email || !emailRegex.test(email)) {
      return resHandler(res, config.failed, true, errorMsg.invalidEmail);
    }

    if (!password || !passwordRegex.test(password)) {
      return resHandler(res, config.failed, true, errorMsg.invalidPwd);
    }
    
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      return resHandler(res, config.failed, true, errorMsg.invalidPhone);
    }

    if (!role) {
      return resHandler(res, config.failed, true, errorMsg.invalidRole);
    }

    next();
  };
};

const signinValidation = () => {
  return (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !emailRegex.test(email)) {
      return resHandler(res, config.failed, true, errorMsg.invalidEmail);
    }

    if (!password || !passwordRegex.test(password)) {
      return resHandler(res, config.failed, true, errorMsg.invalidPwd);
    }
    next();
  }
}

const categoryValidation = () => {
  return (req, res, next) => {
    const name = req.body.name;
    if (!name || !name.trim())
      return resHandler(res, config.failed, true, errorMsg.invalidCategory);
    
    next();
  }
}

const productValidation = () => {
  return (req, res, next) => {
    const { name, price } = req.body;
    
    if (!req.files.productImage)
      return resHandler(res, config.failed, true, errorMsg.noProductImage);

    if (!name || !name.trim())
      return resHandler(res, config.failed, true, errorMsg.invalidCategory);
    
    if (!price || Number(price) == NaN)
      return resHandler(res, config.failed, true, errorMsg.invalidPrice);

    next();
  }
}

module.exports = {
  signinValidation,
  signupValidation,
  categoryValidation,
  productValidation
}
