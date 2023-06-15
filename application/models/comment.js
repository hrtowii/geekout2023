const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  comments: { type: String, required: true },
  likes: { type: Number, required: true },
});

module.exports = mongoose.model("comment", commentSchema);
