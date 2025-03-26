const { Transaction } = require('../../model');
const { status } = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');

const index = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['status', 'customer']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const orders = await Transaction.paginate(filter, options);
    return res.status(200).send(orders);
});

const create = catchAsync(async (req, res) => {
    const orders = await Transaction.create({...req.body, user: req.user.id});
    return res.status(status.CREATED).send(orders);
});

module.exports = {
    create,
    index
};