const { Season } = require('../../model');
const { status } = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const searchFilter = require('../../utils/searchFilter');
const moment = require("moment");

const index = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['status', 'customer']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const search = searchFilter(req.query.search, ["name"]);
    const seasons = await Season.paginate(Object.assign(filter, search), options);
    return res.status(200).send(seasons)
});

const create = catchAsync(async (req, res) => {
    const seasons = await Season.create({...req.body, user: req.user.id});
    return res.status(status.CREATED).send(seasons);
});

const dropdown = catchAsync(async (req, res) => {
    
    const seasons = await Season.find({}).sort({
        "createdAt": -1
    });
    const customOptions = [
        {
            name: "All Time",
            startDate: "",  
            endDate: moment().endOf('day').toISOString(),
        },
        {
            name: "Last 7 days",
            startDate: moment().subtract(7, 'days').startOf('day').toISOString(),
            endDate: moment().endOf('day').toISOString(),
        },
        {
            name: "Last 30 days",
            startDate: moment().subtract(30, 'days').startOf('day').toISOString(),
            endDate: moment().endOf('day').toISOString(),
        },
        {
            name: "Last 3 months",
            startDate: moment().subtract(3, 'months').startOf('day').toISOString(),
            endDate: moment().endOf('day').toISOString(),
        },
        {
            name: "Last 6 months",
            startDate: moment().subtract(6, 'months').startOf('day').toISOString(),
            endDate: moment().endOf('day').toISOString(),
        }
    ];
    return res.status(200).send([...seasons, ...customOptions]);
});

module.exports = {
    create,
    index,
    dropdown
};