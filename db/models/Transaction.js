const { Schema, model } = require("mongoose");

const TransactionSchema = Schema(
  {
    account: { type: Schema.Types.ObjectId },
    amount: {
      type: Number,
      required: [true, "Please add an amount to transfer"],
      min: [0, "Account balance cannot be negative"],
    },
    type: {
      type: String,
      enum: {
        values: ["withdraw", "deposit", "transfer"],
        message:
          "Please ensure you have selected a valid type for the transaction type",
      },
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
  },
  { timestamps: true }
);

module.exports = model("Transaction", TransactionSchema);
