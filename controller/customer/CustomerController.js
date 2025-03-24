const { Customer } = require('../../model');
const { status } = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const pick = require('../../utils/pick');
const {ObjectId} = require("mongodb")

const index = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['status']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const customers = await Customer.paginate(filter, options);
    return res.status(200).send(customers);
});

const create = catchAsync(async (req, res) => {
    if (await Customer.isNumberTaken(req.body.number)) throw new ApiError(status.BAD_REQUEST, 'Number already taken');
    const customers = await Customer.create({...req.body, user: req.user?._id});
    return res.status(status.CREATED).send(customers);
});

const detail = catchAsync(async (req, res) => {
    const { id } = req.params;
    const [ customer ] = await Customer.aggregate([
        {
            $match: {
                _id: new ObjectId(id)
            }
        },
        {
            $lookup: {
              from: "transactions",
              localField: "_id",
              foreignField: "customer",
              as: "transactions"
            }
          },
          {
            $unwind: "$transactions"
          },
          {
            $lookup: {
              from: "orders",
              localField: "_id",
              foreignField: "customer",
              as: "order"
            }
          },
          {
            $unwind: "$order"
          },
          {
            
            $group: {
              _id: "$_id",
              firstName: { $first: "$firstName" },
              lastName: { $first: "$lastName" },
              fatherName: { $first: "$fatherName" },
              number: { $first: "$number" },
              alternateNumber: { $first: "$alternateNumber" },
              address: { $first: "$address" },
              paidAmount: { $sum: "$transactions.amount" },
              totalAmount: { $sum: "$order.actualPrice" }
            }
          }
    ]);
    return res.status(status.CREATED).send(customer);
});


module.exports = {
    create,
    index,
    detail
};