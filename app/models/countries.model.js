const mongoose = require('mongoose');

const Languages = new mongoose.Schema({});
const Currencies = new mongoose.Schema({});

const Countries = new mongoose.Schema({
    name: { type: String },
    languages: [Languages],
    CCA2: { type: String },
    CCA3:{ type: String },
    CCN3: { type: String },
    currencies:[Currencies],
    region:{ type: String },
    latitudeAndLongitude:[{ type: Number }],
  });

  
module.exports = mongoose.model('countries', Countries);