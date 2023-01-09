const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
dotenv.config();
require("./mongodbconn");
const Song = require("./schema/songs");

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.post("/addsong", async (req, res) => {
  const { song_name, song_image, song_artist, song_link } = req.body;
  try {
    const addedsong = await Song.create({
      song_name,
      song_image,
      song_artist,
      song_link,
    });
    res.status(200).send(addedsong);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

app.get("/getallsongs", async (req, res) => {
  try {
    const songs = await Song.find().sort("song_name");
    // console.log(songs.length);
    res.status(200).send(songs);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

app.get("/getcustomsongs", async (req, res) => {
  try {
    const count = await Song.count();
    const songs = await Song.aggregate([{ $sample: { size: count } }]);
    res.status(200).send(songs);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

app.get("/getcustomsong", async (req, res) => {
  try {
    const songs = await Song.aggregate([{ $sample: { size: 1 } }]);
    res.status(200).send(songs);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

app.get("/get/unlimited/songs", async (req, res) => {
  try {
    let page = req.query.page || 1;
    let limit = req.query.limit || 5;
    let skip = (page - 1) * limit;
    const data = await Song.find().skip(skip).limit(limit);
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

// app.post("/getthissong", async (req, res) => {
//     const { sid } = req.body;
//     try {
//         const currentsong = await Song.findOne({ _id: sid });
//         res.status(200).send(currentsong)
//     } catch (e) {
//         console.log(e);
//         res.status(500).send(e)
//     }
// })

// app.post("/getnextsong", async (req, res) => {
//     const { sid } = req.body;
//     try {
//         const currentsong = await Song.findOne({ _id: { $gt: sid } }).sort({ song_name: 1 });
//         res.status(200).send(currentsong)
//         // console.log(currentsong);
//     } catch (e) {
//         console.log(e);
//         res.status(500).send(e)
//     }
// })

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
