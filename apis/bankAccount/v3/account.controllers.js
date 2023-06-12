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
    const foundAccount = await Account.findOne({ owner: req.user._id });
    return res.status(200).json(foundAccount);
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
      { $inc: { amount: req.body.amount } },
      { runValidators: true, new: true }
    );
    const transaction = await Transaction.create({
      amount: req.body.amount,
      account: account._id,
      type: "deposit",
    });

    // Could update response
    //     return res.status(200).json({ ...account._doc, transaction });
    return res.status(200).json({ account, transaction });
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
      { $inc: { amount: req.body.amount * -1 } },
      { runValidators: true, new: true }
    );
    const transaction = await Transaction.create({
      amount: req.body.amount,
      account: account._id,
      type: "withdraw",
    });

    // Could update response
    //     return res.status(200).json({ ...updatedAccount._doc, transaction });
    return res.status(200).json({ ...updatedAccount, transaction });
  } catch (err) {
    next(err);
  }
};

exports.transferAmount = async (req, res, next) => {
  try {
    if (req.user._id.equals(req.receiver._id)) {
      return next({
        status: 400,
        name: "Validation Error",
        message:
          "Cannot transfer to the same account from the same source. Use Deposit.",
      });
      }
      const senderAccount = await Account.findOne({ owner: req.user._id });

      if (senderAccount.amount - req.body.amount < 0) {
        return next({
          status: 400,
          name: "Validation Error",
          message: "Account Balance cannot be less than zero",
        });
      }
  
      await Account.findOneAndUpdate(
        { owner: req.user._id },
        { $inc: { amount: req.body.amount * -1 } },
        { runValidators: true, new: true }
      );
      
    const receiverAccount = await Account.findByIdAndUpdate(
      req.receiver._id,
      { $inc: { amount: req.body.amount } },
        { runValidators: true, new: true }
    );
    const transaction = await Transaction.create({
      senderId: senderAccount._id,
      type: "transfer",
      amount: req.body.amount,
      receiverId: receiverAccount._id,
    });
    return res.status(200).json({ transaction });
  } catch (err) {
    next(err);
  }
};
