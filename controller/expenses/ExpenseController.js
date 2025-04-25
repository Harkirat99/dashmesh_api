const { Expense } = require('../../model');
const { status } = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const searchFilter = require('../../utils/searchFilter');

const index = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['status']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const search = searchFilter(req.query.search, ["name"]);
    const results = await Expense.paginate(Object.assign(filter, search), options);
    return res.status(200).send(results)
});

const create = catchAsync(async (req, res) => {
    const seasons = await Expense.create({...req.body, user: req.user.id});
    return res.status(status.CREATED).send(seasons);
});

module.exports = {
    create,
    index
};