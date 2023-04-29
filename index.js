const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/care-alliance', { useNewUrlParser: true });

const Community = mongoose.model('Community', {
  name: String,
  interest: String,
  description: String,
});

const Event = mongoose.model('Event', {
  name: String,
  date: Date,
  description: String,
  location: String,
});

app.post('/communities', (req, res) => {
  const community = new Community({
    name: req.body.name,
    interest: req.body.interest,
    description: req.body.description,
  });

  community.save((err) => {
    if (err) {
      res.status(500).send({ error: err });
    } else {
      res.send({ message: 'Community created successfully' });
    }
  });
});

app.get('/communities', (req, res) => {
  const query = {};

  if (req.query.interest) {
    query.interest = req.query.interest;
  }

  Community.find(query, (err, communities) => {
    if (err) {
      res.status(500).send({ error: err });
    } else {
      res.send(communities);
    }
  });
});

app.post('/events', (req, res) => {
  const event = new Event({
    name: req.body.name,
    date: req.body.date,
    description: req.body.description,
    location: req.body.location,
  });

  event.save((err) => {
    if (err) {
      res.status(500).send({ error: err });
    } else {
      res.send({ message: 'Event created successfully' });
    }
  });
});

app.get('/events', (req, res) => {
  const query = {};

  if (req.query.location) {
    query.location = req.query.location;
  }

  Event.find(query, (err, events) => {
    if (err) {
      res.status(500).send({ error: err });
    } else {
      res.send(events);
    }
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
