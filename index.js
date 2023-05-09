const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.json());
app.use(cors());


const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/care-alliance";
const PORT = process.env.PORT || 3000;


const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database");
});

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   
  });

const Community =  mongoose.model('Community', {
  name: String,
  interest: String,
  description: String,
});

const Event = mongoose.model('Event', {
  name: String,
  date: Date,
  description: String,
  location: String,
  locationValue : String,
});

app.post('/communities', (req, res) => {
  const community = new Community({
    name: req.body.name,
    interest: req.body.interest,
    description: req.body.description,
  });

  community.save()
    .then(() => {
      res.send({ message: 'Community created successfully' });
    })
    .catch((err) => {
      res.status(500).send({ error: err });
    });
});


app.get('/communities/:key', async (req, res) => {
  try {
    const searchQuery = req.params.key;
    const searchRegex = new RegExp(searchQuery, 'i');
    const results = await Community.find({
      $or: [
        { name: searchRegex },
        { interest: searchRegex },
        { description: searchRegex }
      ]
    }).exec();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});




app.get('/events/:key', async (req, res) => {
  try {
    const searchQuery = req.params.key;
    const searchRegex = new RegExp(searchQuery, 'i');
    const results = await Event.find({
      $or: [
        { name: searchRegex },
        { date: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { locationValue: searchRegex }
      ]
    }).exec();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/events', (req, res) => {
  const event = new Event({
    name: req.body.name,
    date: req.body.date,
    description: req.body.description,
    location: req.body.location,
    locationValue:req.body.locationValue
  });

  event.save()
    .then(() => {
      res.send({ message: 'Event created successfully' });
    })
    .catch((err) => {
      res.status(500).send({ error: err });
    });
});
  


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
  
  app.get("/", (req,res) =>{
      res.send("hello");
  })
  