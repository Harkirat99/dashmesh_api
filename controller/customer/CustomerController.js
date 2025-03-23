const { Customer } = require('../../model');
const { status } = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const pick = require('../../utils/pick');


const index = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['status']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const customers = await Customer.paginate(filter, options);
    return res.status(200).send(customers);
});

const create = catchAsync(async (req, res) => {
    if (await Customer.isNumberTaken(req.body.number)) throw new ApiError(status.BAD_REQUEST, 'Number already taken');
    const customer = await Customer.create({...req.body, user: req.user?._id});
    return res.status(status.CREATED).send(customer);
});


module.exports = {
    create,
    index
};