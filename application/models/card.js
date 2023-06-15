const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  type: { type: Number, required: true },
  step: { type: Number, required: true },
  interval: { type: Number, required: true },
  ease: { type: Number, required: true },
  dueDate: { type: Number, required: true },
  deck: {
    type: Schema.Types.ObjectId,
    ref: "deck",
  },
});

module.exports = mongoose.model("card", cardSchema);
