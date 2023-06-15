const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deckSchema = new Schema({
  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: "card",
    },
  ],
});

module.exports = mongoose.model("deck", deckSchema);
