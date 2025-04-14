const { Customer } = require("../../model");
const { status } = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const pick = require("../../utils/pick");
const searchFilter = require("../../utils/searchFilter");
const { ObjectId } = require("mongodb");

const index = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["status"]);
  const search = searchFilter(req.query.search, ["firstName", "lastName"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const customers = await Customer.paginate(
    Object.assign(filter, search),
    options
  );
  return res.status(200).send(customers);
});

const create = catchAsync(async (req, res) => {
  if (await Customer.isNumberTaken(req.body.number))
    throw new ApiError(status.BAD_REQUEST, "Number already taken");
  const customers = await Customer.create({ ...req.body, user: req.user?._id });
  return res.status(status.CREATED).send(customers);
});

const detail = catchAsync(async (req, res) => {
  const { id } = req.params;
  const [customer] = await Customer.aggregate([
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "transactions",
        localField: "_id",
        foreignField: "customer",
        as: "transactions",
      },
    },
    {
      $addFields: {
        paidAmount: {
          $sum: "$transactions.amount",
        },
      },
    },
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "customer",
        as: "order",
      },
    },
    {
      $addFields: {
        totalAmount: {
          $sum: {
            $map: {
              input: "$order",
              as: "o",
              in: { $multiply: ["$$o.price", "$$o.quantity"] },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        fatherName: 1,
        number: 1,
        alternateNumber: 1,
        address: 1,
        paidAmount: 1,
        totalAmount: 1,
      },
    },
  ]);

  console.log("customer", customer);
  return res.status(200).send(customer);
});

const ledger = catchAsync(async (req, res) => {
  const { id } = req.params;
  const seasonStart = new Date("2025-01-01");
  const seasonEnd = new Date("2025-05-31");

  const [customer] = await Customer.aggregate([
    {
      $match: { _id: new ObjectId(id) },
    },
    // Get all transactions
    {
      $lookup: {
        from: "transactions",
        localField: "_id",
        foreignField: "customer",
        as: "transactions",
      },
    },
    // Get all orders
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "customer",
        as: "orders",
      },
    },
    // Add season-based fields
    {
      $addFields: {
        seasonTransactions: {
          $filter: {
            input: "$transactions",
            as: "t",
            cond: {
              $and: [
                { $gte: ["$$t.date", seasonStart] },
                { $lte: ["$$t.date", seasonEnd] },
              ],
            },
          },
        },
        seasonOrders: {
          $filter: {
            input: "$orders",
            as: "o",
            cond: {
              $and: [
                { $gte: ["$$o.date", seasonStart] },
                { $lte: ["$$o.date", seasonEnd] },
              ],
            },
          },
        },
        pastTransactions: {
          $filter: {
            input: "$transactions",
            as: "t",
            cond: { $lt: ["$$t.date", seasonStart] },
          },
        },
        pastOrders: {
          $filter: {
            input: "$orders",
            as: "o",
            cond: { $lt: ["$$o.date", seasonStart] },
          },
        },
      },
    },
    // Compute balances
    {
      $addFields: {
        pastPaidAmount: { $sum: "$pastTransactions.amount" },
        pastTotalAmount: {
          $sum: {
            $map: {
              input: "$pastOrders",
              as: "o",
              in: { $multiply: ["$$o.price", "$$o.quantity"] },
            },
          },
        },
        seasonPaidAmount: { $sum: "$seasonTransactions.amount" },
        seasonTotalAmount: {
          $sum: {
            $map: {
              input: "$seasonOrders",
              as: "o",
              in: { $multiply: ["$$o.price", "$$o.quantity"] },
            },
          },
        },
      },
    },
    {
      $addFields: {
        balanceBeforeSeason: {
          $subtract: ["$pastTotalAmount", "$pastPaidAmount"],
        },
        balanceInSeason: {
          $subtract: ["$seasonTotalAmount", "$seasonPaidAmount"],
        },
        currentBalance: {
          $subtract: [
            { $add: ["$pastTotalAmount", "$seasonTotalAmount"] },
            { $add: ["$pastPaidAmount", "$seasonPaidAmount"] },
          ],
        },
      },
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        number: 1,
        seasonOrders: 1,
        seasonTransactions: 1,
        balanceBeforeSeason: 1,
        balanceInSeason: 1,
        currentBalance: 1,
      },
    },
  ]);
  const newOrders = await joinOrders(customer?.seasonOrders);

  console.log("balanceBeforeSeason", customer?.balanceBeforeSeason)
  const entities = await joinTransactionsOrders(newOrders, customer?.seasonTransactions, customer?.balanceBeforeSeason);
  return res.status(200).send(entities);
});


const joinOrders = async (orders) => {
  const entities = [];
    for (const order of orders) {
      const index = await entities.findIndex((entity) => entity?.siblingId == order.siblingId);
      if(index != -1 ){
        entities[index].items.push({
          product: order?.product,
              unit: order?.unit,
              size: order?.size,
              price: order?.price,
              _id: order?._id
        });
        entities[index].totalPrice += order?.price;
      }else{
        entities.push({
          date: order?.date,
          siblingId: order?.date,
          createdAt: order?.createdAt,
          totalPrice: order?.price,
          type: "order",
          items: [
            {
              product: order?.product,
              unit: order?.unit,
              size: order?.size,
              price: order?.price,
              _id: order?._id
            }
          ]
        })
      }
    }
  return entities;
}

const joinTransactionsOrders = (orders, transactions, balanceBeforeSeason = 0) => {
  const combined = [...orders, ...transactions].sort((a, b) => a?.date - b?.date);

  let prevBalance = balanceBeforeSeason;

  return combined.map((item) => {
    if(item?.type == "order") {
      // Add to balance
      prevBalance += item?.totalPrice;
      return {
        ...item,
        balance: prevBalance
      }
    }else{
      // subtract from balance
      prevBalance -= item?.amount;
      return {
        ...item,
        balance: prevBalance
      }
    }
  });
}

module.exports = {
  create,
  index,
  detail,
  ledger,
};
