const { Schema, model } = require("mongoose");

const UserSchema = Schema(
  {
    username: {
      type: String,
      unique: [true, "This username already exists"],
      required: [true, "Please provide a username"],
    },
    image: {
      type: String,
      required: [true, "Please provide an image for picture ID"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      select: false,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);
