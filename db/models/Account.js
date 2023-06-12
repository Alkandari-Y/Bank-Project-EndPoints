const { Schema, model } = require("mongoose");

const AccountSchema = Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, "Account balance cannot be below 0"],
    },
  },
  { timestamps: true }
);

module.exports = model("Account", AccountSchema);
