const User = require("../../../db/models/User");
const Account = require("../../../db/models/Account");
const Transaction = require("../../../db/models/Transaction");

exports.getAccountByUserName = async (username) => {
  try {
    const foundUser = await User.findOne({ username }).populate("account");
    return foundUser;
  } catch (err) {
    next(err);
  }
};

exports.getUserAccount = async (req, res, next) => {
  try {
    return res.status(200).json(req.user.account);
  } catch (err) {
    next(err);
  }
};

exports.getUserTransactions = async (req, res, next) => {
  try {
    const userTransactions = await Transaction.find({
      $or: [
        { account: req.user.account },
        { senderId: req.user.account },
        { receiverId: req.user.account },
      ],
    }).sort("field -createdAt");
    return res.status(200).json(userTransactions);
  } catch (err) {
    next(err);
  }
};

exports.depositAmount = async (req, res, next) => {
  try {
    const account = await Account.findOneAndUpdate(
      { owner: req.user._id },
      { $inc: { balance: req.body.amount } },
      { runValidators: true, new: true }
    );
    const transaction = await Transaction.create({
      amount: req.body.amount,
      account: account._id,
      type: "deposit",
    });

    return res.status(200).json({ ...account._doc, transaction });
  } catch (err) {
    next(err);
  }
};

exports.withdrawAmount = async (req, res, next) => {
  try {
    const account = await Account.findOne({ owner: req.user._id });

    if (account.amount - req.body.amount < 0) {
      return next({
        status: 400,
        name: "Validation Error",
        message: "Account Balance cannot be less than zero",
      });
    }

    const updatedAccount = await Account.findOneAndUpdate(
      { owner: req.user._id },
      { $inc: { balance: req.body.amount * -1 } },
      { runValidators: true, new: true }
    );
    const transaction = await Transaction.create({
      amount: req.body.amount,
      account: account._id,
      type: "withdraw",
    });

    return res.status(200).json({ ...updatedAccount._doc, transaction });
  } catch (err) {
    next(err);
  }
};

// @param req.receivingAccount is an account instance for the
// @param username url param
exports.transferAmount = async (req, res, next) => {
  try {
    if (req.user.account.equals(req.receivingAccount)) {
      return next({
        status: 400,
        name: "Validation Error",
        message: "Cannot transfer to the same account. Use Deposit.",
      });
    }

    if (req.user.account.balance - req.body.amount < 0) {
      return next({
        status: 400,
        name: "Validation Error",
        message: "Account Balance cannot be less than zero",
      });
    }

    await req.user.account.updateOne({
      $inc: { balance: req.body.amount * -1 },
    });

    await req.receivingAccount.updateOne({
      $inc: { balance: req.body.amount },
    });

    const transaction = await Transaction.create({
      senderId: req.user.account._id,
      type: "transfer",
      amount: req.body.amount,
      receiverId: req.receivingAccount._id,
    });
    return res.status(200).json({ transaction });
  } catch (err) {
    next(err);
  }
};
