const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  bloggerID: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: String,
  comments: [
    {
      email: String,
      comment: String,
    },
  ],
  tags: [String],
});

module.exports = mongoose.model("Blogs", blogSchema);
