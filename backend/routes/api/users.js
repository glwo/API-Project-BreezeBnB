const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check("firstName")
    .exists({ checkFalsy: true }),
  check("lastName")
    .exists({ checkFalsy: true }),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;

    const takenUser = await User.findOne({
      where: { username: username}
    })

    const takenEmail = await User.findOne({
      where: { email: email}
    })

    if(takenUser){
      res.status(403);
      res.json({
        message: "User already exists",
        statusCode: 403,
        errors: {
          email: "User with that username already exists"
        }
      })
    }

    if(takenEmail){
      res.status(403);
      res.json({
        message: "User already exists",
        errors: {
          email: "User with that email already exists"
        }
      })
    } else {
    const user = await User.signup({ firstName, lastName, email, username, password });

    await setTokenCookie(res, user);

    return res.json({
      user: user.toSafeObject()
    });
  }
}
);

module.exports = router;
