var express = require("express");
var logger = require("morgan");
var cors = require("cors");
require("./database/conn");

app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use("/images", express.static("images"));

app.use("/blogger", require("./routes/bloggerRoute"));
app.use("/public", require("./routes/publicRoute"));

app.listen(4000, () => {
  console.log("server started ");
});
