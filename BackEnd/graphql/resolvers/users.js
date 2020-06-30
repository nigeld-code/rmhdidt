const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const User = require('../../models/user');

module.exports = {
  createUser: args => {
    if (args.userInput.secretPin !== process.env.SIGNUP_PIN) {
      const error = new Error('Invalid PIN');
      error.code = 401;
      throw error;
    }
    const errors = [];
    args.userInput.username = validator.trim(args.userInput.username);
    args.userInput.username = validator.whitelist(
      args.userInput.username,
      'A-Za-z0-9'
    );
    if (
      validator.isEmpty(args.userInput.username) ||
      !validator.isLength(args.userInput.username, { min: 4, max: 30 })
    ) {
      errors.push({ message: 'username is invalid' });
    }
    if (!validator.isEmail(args.userInput.email)) {
      errors.push({ message: 'Email is invalid' });
    }
    if (
      validator.isEmpty(args.userInput.password) ||
      !validator.isLength(args.userInput.password, { min: 6, max: 30 })
    ) {
      errors.push({ message: 'Password is too short' });
    }
    if (!validator.isAscii(args.userInput.password)) {
      errors.push({ message: 'Password contains invalid characters'});
    }
    if (errors.length > 0) {
      const error = new Error('Invalid Input');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    return User.findOne({ email: args.userInput.email })
      .then(user => {
        if (user) {
          const error = new Error('Email already exists');
          error.code = 401;
          throw error;
        }
        return User.findOne({ username: args.userInput.username })
          .then(username => {
            if (username) {
              const error = new Error('Username already exists');
              error.code = 401;
              throw error;
            }
            return bcrypt.hash(args.userInput.password, 12);
          })
          .catch(err => {
            throw err;
          });
      })
      .then(hashedPassword => {
        const user = new User({
          username: args.userInput.username,
          email: args.userInput.email,
          password: hashedPassword
        });
        return user.save();
      })
      .then(result => {
        console.log({ ...result._doc, password: null, _id: result.id });
        return { ...result._doc, password: null, _id: result.id };
      })
      .catch(err => {
        throw err;
      });
  },
  loginUser: args => {
    let user;
    return User.findOne({ email: args.email })
      .then(result => {
        if (!result) {
          const error = new Error("Login Error: Wrong Email or Password");
          error.code = 401;
          throw error;
        }
        user = result;
        return bcrypt.compare(args.password, user.password);
      })
      .then(result => {
        if (!result) {
          const error = new Error('Login Error: Wrong Email or Password');
          error.code = 401;
          throw error;
        }
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_KEY,
          {
            expiresIn: '1h'
          }
        );
        return { userId: user.id, username: user.username, token: token, tokenExpiration: 1 };
      })
      .catch(err => {
        throw err;
      });
  }
};
