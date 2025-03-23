const { status } = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { User, Token } = require('../../model');
const tokenService = require("../../services/token");
const ApiError = require('../../utils/ApiError');
const { tokenTypes } = require("../../config/tokens")

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
    const refreshTokenDoc = await tokenService.verifyToken(req.body.refreshToken, tokenTypes.REFRESH);
    const user = await User.findOne({
      _id: refreshTokenDoc.user
    });

    if (!user) {
      throw new Error();
    }
    // await refreshTokenDoc.remove();
    await Token.deleteOne({
      _id: refreshTokenDoc?._id
    });

    const tokens = await  tokenService.generateAuthTokens(user);
    res.send({ ...tokens });

  } catch (error) {
    console.log("ERROR", error)
    throw new ApiError(status.BAD_REQUEST, 'Please authenticate');
  }
});

module.exports = {
  register,
  login,
  refreshTokens
};