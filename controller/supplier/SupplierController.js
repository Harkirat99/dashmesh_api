const { Supplier } = require("../../model");
const { status } = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const pick = require("../../utils/pick");
const searchFilter = require("../../utils/searchFilter");
const { ObjectId } = require("mongodb");

const index = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["status", "customer"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const search = searchFilter(req.query.search, ["name"]);
  const suppliers = await Supplier.paginate(
    Object.assign(filter, search),
    options
  );
  return res.status(200).send(suppliers);
});

const create = catchAsync(async (req, res) => {
  const suppliers = await Supplier.create({ ...req.body, user: req.user.id });
  return res.status(status.CREATED).send(suppliers);
});

const detail = catchAsync(async (req, res) => {
  const { id } = req.params;
  const [entity] = await Supplier.aggregate([
    {
      $match: {

        _id: new ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "stocks",
        localField: "_id",
        foreignField: "supplier",
        as: "supplier",
      },
    },
    {
      $addFields: {
        totalAmount: {
          $sum: "$supplier.grandTotal",
        },
      },
    },
    {
        $addFields: {
          totalOrderValue: {
            $sum: "$supplier.orderValue",
          },
        },
    },
    {
        $addFields: {
          totalCharges: {
            $sum: "$supplier.additionalCharges",
          },
        },
    },
    {
        $addFields: {
          totalTax: {
            $sum: "$supplier.taxAmount",
          },
        },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        address: 1,
        number: 1,
        account: 1,
        ifsc: 1,
        totalAmount: 1,
        totalOrderValue: 1,
        totalCharges: 1,
        totalTax: 1
      },
    },
  ]);
  return res.status(200).send(entity);
});

module.exports = {
  create,
  index,
  detail,
};
