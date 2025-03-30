const { Order } = require("../../model");
const catchAsync = require('../../utils/catchAsync');
const moment = require("moment");

const orders = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;
    const filter = {
        createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        },
    }
    const orders = await Order.aggregate([
        { $match: filter },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
              day: { $dayOfMonth: "$date" },
            },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
        }
      ]);

      console.log("Orders", orders);

      const allDates = [];
      let current = moment(startDate).startOf("day");
      const end = moment(endDate).endOf("day");
  
      while (current <= end) {
        allDates.push(current.format("YYYY-MM-DD"));
        current.add(1, "days");
      }
  
      
      // 🛠️ Step 2: Map the orders to respective dates
      const orderMap = {};
      orders.forEach((order) => {
        const date = `${order._id.year}-${String(order._id.month).padStart(2, "0")}-${String(order._id.day).padStart(2, "0")}`;
        orderMap[date] = order.totalOrders;
      });
  
      // 🛠️ Step 3: Fill missing dates with 0 orders
      const chartData = allDates.map((date) => ({
        date,
        order: orderMap[date] || 0,
      }));

      
      // const chartData = orders.map((order) => ({
      //   date: `${order._id.year}-${String(order._id.month).padStart(2, "0")}-${String(order._id.day).padStart(2, "0")}`,
      //   order: order.totalOrders
      // }));


    return res.status(200).send(chartData);
});

const createPayload = () => {

};


module.exports = {
    orders
}

