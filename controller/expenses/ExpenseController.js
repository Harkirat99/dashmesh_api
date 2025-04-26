const { Expense, Order, Transaction } = require('../../model');
const { status } = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const searchFilter = require('../../utils/searchFilter');
const moment = require("moment");

const index = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['status']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const search = searchFilter(req.query.search, ["name"]);
    const results = await Expense.paginate(Object.assign(filter, search), options);
    return res.status(200).send(results)
});

const create = catchAsync(async (req, res) => {
    const expense = await Expense.create({...req.body, user: req.user.id});
    return res.status(status.CREATED).send(expense);
});


const ledger = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;
  
    if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required in YYYY-MM-DD format" });
      }
    
      // Parse and validate dates
      const seasonStart = moment(startDate);
      const seasonEnd = moment(endDate);
    
      if (!seasonStart.isValid() || !seasonEnd.isValid()) {
        return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
      }
    
      const seasonStartDate = seasonStart.toDate();
      const seasonEndDate = seasonEnd.toDate();
    
    // Step 1: Get opening transactions and expenses before startDate
    const openingTransactions = await Transaction.find({ date: { $lt: seasonStartDate } }).lean();
    const openingExpenses = await Expense.find({ date: { $lt: seasonStartDate } }).lean();
  
    let p1Balance = 0; // Sandeep
    let p2Balance = 0; // Harmeet
  
    // Opening balance from transactions
    for (const txn of openingTransactions) {
      if (txn.paymentType === "cash") p1Balance += txn.amount;
      else if (txn.paymentType === "online") p2Balance += txn.amount;
    }
  
    // Opening balance from expenses
    for (const exp of openingExpenses) {
      if (exp.partner === "Sandeep") p1Balance -= exp.amount;
      else if (exp.partner === "Harmeet") p2Balance -= exp.amount;
    }
  
    const openingBalance = {
      p1: p1Balance,
      p2: p2Balance
    };
  
    // Step 2: Get data for the season (within date range)
    const seasonTransactions = await Transaction.find(
      { date: { $gte: seasonStart, $lte: seasonEnd } },
      { _id: 0, amount: 1, paymentType: 1, customer: 1, date: 1 }
    ).populate("customer").lean();
  
    const seasonExpenses = await Expense.find(
      { date: { $gte: seasonStart, $lte: seasonEnd } },
      { _id: 0, amount: 1, partner: 1, date: 1, note: 1 }
    ).lean();
  
    // Tag both sources
    const taggedTransactions = seasonTransactions.map(txn => ({
      ...txn,
      source: "transaction"
    }));
  
    const taggedExpenses = seasonExpenses.map(exp => ({
      ...exp,
      source: "expense"
    }));
  
    // Combine and sort by date
    const combined = [...taggedTransactions, ...taggedExpenses].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  
    // Step 3: Build the transaction log and update running balances
    const transactionLog = combined.map(txn => {
      let note = "";
      let partner = "";
      let amount = txn.amount;
  
      if (txn.source === "transaction") {
        note = `${txn.customer.firstName} Paid`;
        if (txn.paymentType === "cash") {
          p1Balance += amount;
          partner = "Sandeep";
        } else if (txn.paymentType === "online") {
          p2Balance += amount;
          partner = "Harmeet";
        }
      } else if (txn.source === "expense") {
        note = txn.note;
        if (txn.partner === "Sandeep") {
          p1Balance -= amount;
          partner = "Sandeep";
        } else if (txn.partner === "Harmeet") {
          p2Balance -= amount;
          partner = "Harmeet";
        }
      }
  
      return {
        date: txn.date,
        source: txn.source,
        type: txn.paymentType || txn.partner,
        amount: txn.amount,
        note,
        partner,
        p1Balance,
        p2Balance
      };
    });
    
    const reverseArray = transactionLog.reverse();

    // Step 4: Send response
    return res.status(status.OK).send({
      openingBalance,
      transactions: reverseArray
    });
  });
  
  

module.exports = {
    create,
    index,
    ledger
};