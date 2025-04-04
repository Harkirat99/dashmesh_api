const { Supplier } = require('../../model');
const { status } = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const searchFilter = require('../../utils/searchFilter');

const index = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['status', 'customer']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const search = searchFilter(req.query.search, ["name"]);
    const suppliers = await Supplier.paginate(Object.assign(filter, search), options);
    return res.status(200).send(suppliers)
});

const create = catchAsync(async (req, res) => {
    const suppliers = await Supplier.create({...req.body, user: req.user.id});
    return res.status(status.CREATED).send(suppliers);
});


module.exports = {
    create,
    index
};