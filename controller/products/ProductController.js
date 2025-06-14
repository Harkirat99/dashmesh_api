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
        populate: "supplier,stock"
    }
    const products = await Product.paginate(Object.assign(filter, search), updateOptions);
    return res.status(200).send(products)
});

const create = catchAsync(async (req, res) => {
    const product = await Product.create({...req.body, user: req.user.id});
    return res.status(status.CREATED).send(product);
});

const update = catchAsync(async (req, res) => {
    const allowedFields = ['name', 'quantity', 'leftQuantity', 'size', 'unit', 'price', 'totalPrice', 'salt', 'expiry'];
    const updateData = pick(req.body, allowedFields);
    
    const product = await Product.findByIdAndUpdate(
        req.params.productId,
        updateData,
        { new: true, runValidators: true }
    );
    
    if (!product) {
        return res.status(status.NOT_FOUND).send({ message: 'Product not found' });
    }
    return res.status(200).send(product);
});

const remove = catchAsync(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product) {
        return res.status(status.NOT_FOUND).send({ message: 'Product not found' });
    }
    return res.status(status.NO_CONTENT).send();
});

const dropdown = catchAsync(async (req, res) => {
    const products = await Product.find({
        leftQuantity: {
            $gte: 0
        }
    }).populate({
        path: "stock",
        select: "date"
    }).select("name size unit price leftQuantity");
    return res.status(status.CREATED).send(products);
});

module.exports = {
    create,
    index,
    update,
    remove,
    dropdown
};