const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
  })
  .then((db) => console.log("Db Connected"))
  .catch((error) => console.log(error));
