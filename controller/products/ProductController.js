const { Product } = require('../../model');
const { status } = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const searchFilter = require('../../utils/searchFilter');

const index = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['status', 'customer']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const search = searchFilter(req.query.search, ["name"]);
    const updateOptions = {
        ...options,
        populate: "supplier"
    }
    const products = await Product.paginate(Object.assign(filter, search), updateOptions);
    return res.status(200).send(products)
});

const create = catchAsync(async (req, res) => {
    const product = await Product.create({...req.body, user: req.user.id});
    return res.status(status.CREATED).send(product);
});

const dropdown = catchAsync(async (req, res) => {
    const products = await Product.find({
        leftQuantity: {
            $gte: 0
        }
    }).select("name size unit price leftQuantity");
    return res.status(status.CREATED).send(products);
});


module.exports = {
    create,
    index,
    dropdown
};