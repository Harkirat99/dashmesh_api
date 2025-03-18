const { status } = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { User } = require('../../model');
// const { authService, userService, tokenService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
    res.status(status.CREATED).send({ success: true, message: "Data fetched" });
    const user = await User.create(req.body);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
});

module.exports = {
  register
};