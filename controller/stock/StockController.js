const { Product, Stock } = require("../../model");
const { status } = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const pick = require("../../utils/pick");
const searchFilter = require("../../utils/searchFilter");

const index = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["status", "customer"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const search = searchFilter(req.query.search, ["name"]);
  const products = await Stock.paginate(
    Object.assign(filter, search),
    options
  );
  return res.status(200).send(products);
});

const create = catchAsync(async (req, res) => {
  const input = req.body;
  const userId = req.user?._id;

  const orderValue = input.products.reduce(
    (acc, curr) => acc + curr?.price * curr?.quantity,
    0
  );
  const stockPayload = {
    ...input,
    user: userId,
    orderValue: orderValue,
    grandTotal: orderValue + input?.taxAmount + input?.additionalCharges,
  };

  const stockDetails = await Stock.create(stockPayload);

  const productsPayload = input.products.map((product) => {
    return {
      ...product,
      user: userId,
      stock: stockDetails?._id,
      supplier: input?.supplier,
      leftQuantity: product?.quantity,
    };
  });
  await Product.insertMany(productsPayload);
  return res.status(200).send(stockDetails);
});

module.exports = {
  create,
  index,
};
