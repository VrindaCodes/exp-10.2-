const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DB_FILE = "./db.json";

// utility: read DB
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

// utility: write DB
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// CREATE post
app.post("/posts", (req, res) => {
  const db = readDB();
  const post = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
  };
  db.posts.push(post);
  writeDB(db);
  res.json(post);
});

// READ all posts
app.get("/posts", (req, res) => {
  const db = readDB();
  res.json(db.posts);
});

// UPDATE post
app.put("/posts/:id", (req, res) => {
  const db = readDB();
  const post = db.posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).json({ msg: "not found" });

  post.title = req.body.title;
  post.content = req.body.content;
  writeDB(db);
  res.json(post);
});

// DELETE post
app.delete("/posts/:id", (req, res) => {
  const db = readDB();
  db.posts = db.posts.filter(p => p.id != req.params.id);
  writeDB(db);
  res.json({ msg: "deleted" });
});

app.listen(3000, () => console.log("server running on port 3000"));
