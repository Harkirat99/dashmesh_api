const { status } = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { User } = require('../../model');

const register = catchAsync(async (req, res) => {
    const user = await User.create(req.body);
    const tokens = await tokenService.generateAuthTokens(user);
    return res.status(status.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        email: email
    });
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    const tokens = await tokenService.generateAuthTokens(user);
    return res.status(status[200]).send({ user, tokens });
});

module.exports = {
  register,
  login
};