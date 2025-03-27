const { Order } = require('../../model');
const { status } = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const searchFilter = require('../../utils/searchFilter');

const index = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['customer']);
    const search = searchFilter(req.query.search, ["name"]);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const orders = await Order.paginate(Object.assign(filter, search), options);
    return res.status(200).send(orders);
});


const create = catchAsync(async (req, res) => {
    const input = req.body;
    const payload = input.items.map((item) => {
        return {
            user: req.user,
            customer: input.customer,
            date: moment(input?.date).toISOString(),
            siblingId: uuidv4(),
            ...item
        }
    });
    const orders = await Order.insertMany(payload);
    return res.status(status.CREATED).send(orders);
});


module.exports = {
    create,
    index
};