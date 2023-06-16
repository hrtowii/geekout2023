const path = require("path");
const ejsMate = require("ejs-mate");
const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

const dbURL = process.env.DB_URL;

mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

const Comment = require("./models/comment");
const Deck = require("./models/deck");
const Card = require("./models/card");

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use((req, res, next) => {
  next();
});

app.get("/", (req, res) => {
  res.render("comments.ejs");
});

//CRUD API routes for comments

//retrieve comments
app.get("/api/comments", async (req, res) => {
  const comments = await Comment.find({});
  res.send(comments);
});

//create comments
app.put("/api/comments/create", async (req, res) => {
  const { commentContent } = req.body;
  const newComment = new Comment({
    comment: commentContent,
    likes: 0,
  });
  await newComment.save();
  res.send(newComment);
});

//delete comments
app.put("/api/comments/delete/:id", async (req, res) => {
  const { id } = req.params;
  const thisComment = await Comment.findByIdAndDelete(id);
  res.send(thisComment);
});

//like comment
app.put("/api/comments/like/:id", async (req, res) => {
  const { id } = req.params;
  const thisComment = await Comment.findById(id);
  thisComment.likes += 1;
  await thisComment.save();
  res.send(thisComment);
});

//API routes for flashcard algorithm - implemented halfway, not implemented in front end

//create cards so we have content to work with (test data)
// app.get("/createDeck", async (req, res) => {
//   const cardDeck = require("./chemistry");
//   const deckOne = new Deck({
//     cards: [],
//   });
//   for (let i = 0; i <= cardDeck.notes.length - 1; i++) {
//     const question = cardDeck.notes[i].fields[0];
//     const answer = cardDeck.notes[i].fields[1];
//     const cardOne = new Card({
//       question: question,
//       answer: answer,
//       type: 3,
//       step: 0,
//       interval: 0,
//       ease: 2.5,
//       dueDate: currentDate(),
//       deck: deckOne._id,
//     });
//     await cardOne.save();
//     deckOne.cards.push(cardOne._id);
//   }
//   await deckOne.save();
//   res.send(deckOne);
// });

//load cards
app.get("/api/cards", async (req, res) => {
  const deck = await Deck.find({});
  console.log(deck);
  res.send(deck);
});

//update card progress routes
app.put("/initialization/:id", async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  const updatedCard = await Card.findByIdAndUpdate(
    id,
    { type: type },
    { new: true }
  );
  res.send(updatedCard);
});

app.put("/learning/:id", async (req, res) => {
  const { id } = req.params;
  const { step, interval, dueDate } = req.body;
  const updatedCard = await Card.findByIdAndUpdate(
    id,
    { step: step, interval: interval, dueDate: dueDate },
    { new: true }
  );
  res.send(updatedCard);
});

app.put("/promotion/:id", async (req, res) => {
  const { id } = req.params;
  const { type, interval, dueDate } = req.body;
  const updatedCard = await Card.findByIdAndUpdate(
    id,
    { type: type, interval: interval, dueDate: dueDate },
    { new: true }
  );
  res.send(updatedCard);
});

app.put("/graduation/:id", async (req, res) => {
  const { id } = req.params;
  const { interval, ease, dueDate } = req.body;
  const updatedCard = await Card.findByIdAndUpdate(
    id,
    { interval: interval, ease: ease, dueDate: dueDate },
    { new: true }
  );
  res.send(updatedCard);
});

app.put("/demotion/:id", async (req, res) => {
  const { id } = req.params;
  const { type, step, interval, ease, dueDate } = req.body;
  const updatedCard = await Card.findByIdAndUpdate(
    id,
    {
      type: type,
      step: step,
      interval: interval,
      ease: ease,
      dueDate: dueDate,
    },
    { new: true }
  );
  res.send(updatedCard);
});

const currentDate = () => {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = String(currentDate.getFullYear()).substring(2, 4);
  return `${year}${month}${day}`;
};

app.listen(8080, () => {
  console.log("listening!");
});
