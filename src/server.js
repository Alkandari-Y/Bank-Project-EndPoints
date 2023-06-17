require("dotenv").config();
require("./config/db/connectDb")();

const app = require("./app");

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server running on port ${process.env.PORT || 8000}`);
});
