const { Order, Product } = require('../../model');
const { status } = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const searchFilter = require('../../utils/searchFilter');
const mongoose = require("mongoose");

const index = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['customer']);
    const search = searchFilter(req.query.search, ["name"]);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const updateOptions = {
        ...options,
        populate: "product"
    }
    const orders = await Order.paginate(Object.assign(filter, search), updateOptions);
    return res.status(200).send(orders);
});

const globalOrders = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['customer']);
    const search = searchFilter(req.query.search, ["name"]);

    const orders = await Order.find(Object.assign(filter, search)).populate({
        path: "customer",
        select: "firstName lastName"
    }).populate({
        path: "product",
        select: "name"
    }).sort({'createdAt': -1});

    return res.status(200).send(orders);
});


const create = catchAsync(async (req, res) => {
    const input = req.body;
    const payload = [];
    const siblingId = uuidv4();
    for (const item of input.items) {
        const product = await Product.findById(item.product);
    
        if (!product) throw new Error('Product not found');
    
        if (product.leftQuantity < item.quantity)throw new Error(`Insufficient quantity for product ${product.name}`);
    
        // Update product quantity
        product.leftQuantity -= item.quantity;
        await product.save();
    
        // Prepare order payload
        payload.push({
            user: req.user,
            customer: input.customer,
            date: moment(input?.date).toISOString(),
            siblingId: siblingId,
            ...item
        });
    }
    const orders = await Order.insertMany(payload);
    return res.status(201).send(orders);
});


module.exports = {
    create,
    index,
    globalOrders
};