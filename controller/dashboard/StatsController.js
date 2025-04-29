const { Order, Transaction } = require("../../model");
const catchAsync = require('../../utils/catchAsync');

const stats = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;
    const totalSales = await getTotalSales(startDate, endDate);
    const totalCollected = await getTotalCollected(startDate, endDate);
    return res.status(200).send({
        collected: totalCollected?.amount,
        sale: totalSales?.totalSales,
        due: totalSales?.totalSales - totalCollected?.amount,
    });
})

const getTotalSales = async (startDate, endDate) => {
    const [entity] = await Order.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        },
        {
            $group: {
                _id: null,
                totalSales: { 
                    $sum: { $multiply: ["$price", "$quantity"] }
                }
            }
        }
    ]);
    return entity
}

const getTotalCollected = async (startDate, endDate) => {
    const [ entity ] = await Transaction.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        },
        {
            $group: {
                _id: null,
                amount: { 
                    $sum: "$amount" 
                }
            }
        }
    ]);

    return entity
};

module.exports = {
    stats
}