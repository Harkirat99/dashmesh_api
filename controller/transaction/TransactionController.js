const { Transaction } = require('../../model');
const { status } = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const searchFilter = require('../../utils/searchFilter');

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

const update = catchAsync(async (req, res) => {
    const updateData = pick(req.body, ['date', 'amount', 'category', 'paymentType']);
    const transaction = await Transaction.findByIdAndUpdate(
        req.params.transactionId,
        updateData,
        { new: true, runValidators: true }
    );
    if (!transaction) {
        return res.status(status.NOT_FOUND).send({ message: 'Transaction not found' });
    }
    return res.status(200).send(transaction);
});

const remove = catchAsync(async (req, res) => {
    const transaction = await Transaction.findByIdAndDelete(req.params.transactionId);
    if (!transaction) {
        return res.status(status.NOT_FOUND).send({ message: 'Transaction not found' });
    }
    return res.status(status.NO_CONTENT).send();
});

const globalTransactions = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['customer']);
    const search = searchFilter(req.query.search, ["name"]);
    const transactions = await Transaction.find(Object.assign(filter, search)).populate({
        path: "customer",
        select: "firstName lastName"
    }).sort({'createdAt': -1});
    return res.status(200).send(transactions);
});

module.exports = {
    create,
    index,
    update,
    remove,
    globalTransactions
};