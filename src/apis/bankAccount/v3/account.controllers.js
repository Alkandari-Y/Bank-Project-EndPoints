const { startSession } = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const User = require("../../../models/User");
const Account = require("../../../models/Account");
const Transaction = require("../../../models/Transaction");
const asyncWrapper = require("../../../utils/wrappers/asyncWrapper");

/*
@param req.body.amount will need to be converted to type number to avoid errors
due to use of multer parsing form data and bodyParser for urlEncoding
*/

exports.getAccountByUserName = async (username) => {
  try {
    const foundUser = await User.findOne({ username }).populate("account");
    return foundUser;
  } catch (err) {
    next(err);
  }
};

exports.createBankAccount = asyncWrapper(async (req, res, next) => {
  if (req.user.account)
    return next({
      status: StatusCodes.BAD_REQUEST,
      message: "You already have an account",
    });
  const account = await Account.create({
    owner: req.user._id,
    balance: +req.body.amount || 0,
  });
  req.user.account = account._id;
  await req.user.save();
  return res.status(StatusCodes.OK).json(account);
});

exports.getUserAccount = asyncWrapper(async (req, res) => {
  return res.status(StatusCodes.CREATED).json(req.user.account);
});

exports.getUserTransactions = async (req, res) => {
  const userTransactions = await Transaction.find({
    $or: [
      { account: req.user.account },
      { senderId: req.user.account },
      { receiverId: req.user.account },
    ],
  }).sort("field -createdAt");
  return res.status(StatusCodes.OK).json(userTransactions);
};

exports.depositAmount = asyncWrapper(async (req, res, next) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const account = await Account.findOneAndUpdate(
      { owner: req.user._id },
      { $inc: { balance: +req.body.amount } },
      { session, runValidators: true, new: true }
    );
    const transaction = await Transaction.create(
      [
        {
          amount: +req.body.amount,
          account: account._id,
          type: "deposit",
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    return res
      .status(StatusCodes.CREATED)
      .json({ ...account._doc, transaction });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(error);
  }
});

exports.withdrawAmount = asyncWrapper(async (req, res, next) => {
  if (req.user.account.balance - +req.body.amount < 0) {
    return next({
      status: 400,
      name: "Validation Error",
      message: "Account Balance cannot be less than zero",
    });
  }
  const session = await startSession();
  try {
    session.startTransaction();
    const updatedAccount = await Account.findOneAndUpdate(
      { owner: req.user._id },
      { $inc: { balance: req.body.amount * -1 } },
      { session, runValidators: true, new: true }
    );
    const transaction = await Transaction.create(
      [
        {
          amount: req.body.amount,
          account: req.user.account._id,
          type: "withdraw",
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    return res
      .status(StatusCodes.CREATED)
      .json({ ...updatedAccount._doc, transaction });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});

// @param req.receivingAccount is an account instance for the
// @param username url param
exports.transferAmount = asyncWrapper(async (req, res, next) => {
  if (req.user.account.equals(req.receivingAccount)) {
    return next({
      status: StatusCodes.BAD_REQUEST,
      name: "Validation Error",
      message: "Cannot transfer to the same account. Use Deposit.",
    });
  }

  if (req.user.account.balance - +req.body.amount < 0) {
    return next({
      status: StatusCodes.BAD_REQUEST,
      name: "Validation Error",
      message: "Account Balance cannot be less than zero",
    });
  }

  const session = await startSession();
  try {
    session.startTransaction();
    await req.user.account.updateOne(
      {
        $inc: { balance: +req.body.amount * -1 },
      },
      { session }
    );

    await req.receivingAccount.updateOne(
      {
        $inc: { balance: +req.body.amount },
      },
      { session }
    );

    const transaction = await Transaction.create(
      [
        {
          senderId: req.user.account._id,
          type: "transfer",
          amount: +req.body.amount,
          receiverId: req.receivingAccount._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return res.status(StatusCodes.CREATED).json({ transaction });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(error);
  }
});

exports.getUsersAndAccounts = asyncWrapper(async (req, res) => {
  const users = await User.find().select("username account image");
  return res.status(StatusCodes.OK).json(users);
});
