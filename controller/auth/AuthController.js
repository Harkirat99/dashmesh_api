const { status } = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { User } = require('../../model');
const tokenService = require("../../services/token");
const ApiError = require('../../utils/ApiError');
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
      throw new ApiError(status.BAD_REQUEST, 'Incorrect email or password');
    }
    
    const tokens = await tokenService.generateAuthTokens(user);
    return res.status(200).send({ user, tokens });
});

const refreshTokens = catchAsync(async (req, res) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    const tokens = await  tokenService.generateAuthTokens(user);
    res.send({ ...tokens });

  } catch (error) {
    throw new ApiError(status.UNAUTHORIZED, 'Please authenticate');
  }
});

module.exports = {
  register,
  login,
  refreshTokens
};