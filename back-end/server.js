const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/travel', {
  useNewUrlParser: true
});


// Configure multer so that it will upload to '../front-end/public/images'
const multer = require('multer')
const upload = multer({
  dest: '/var/www/travel.benkwebs.com/images/',
  limits: {
    fileSize: 10000000
  }
});

// Create a scheme for locations in the travel log: a name, date visited, and a path to an image.
const locationSchema = new mongoose.Schema({
  name: String,
  person_id: mongoose.ObjectId,
  dateVisit: String,
  path: String,
});

// Create a schema for people in the travel log: a name, gender, and age
const peopleSchema = new mongoose.Schema({
  name: String,
  gender: String,
  age: Number,
});

// Create a model for locations and people in the travel log.
const Location = mongoose.model('Location', locationSchema);
const People = mongoose.model('People', peopleSchema);

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

// Create a new location in the travel log: takes a name, date visited, and a path to an image.
app.post('/api/locations', async (req, res) => {
  const loc = new Location({
    name: req.body.name,
    person_id: req.body.person_id,
    dateVisit: req.body.dateVisit,
    path: req.body.path,
  });
  try {
    await loc.save();
    res.send(loc);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the locations in the travel log.
app.get('/api/locations', async (req, res) => {
  try {
    let locations = await Location.find();
    res.send(locations);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all the people in the travel log.
app.get('/api/people', async (req, res) => {
  try {
    let people = await People.find();
    res.send(people);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Delete a location from the travel log
app.delete('/api/locations/:id', async (req, res) => {
  try {
    await Location.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Edit a location in the travel log
app.put('/api/locations/:id', async (req, res) => {
  try {
    let loc = await Location.findOne({
      _id: req.params.id
    });
    loc.name = req.body.name;
    loc.person_id = req.body.person_id;
    loc.dateVisit = req.body.dateVisit;
    await loc.save();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(4000, () => console.log('Server listening on port 4000!'));
