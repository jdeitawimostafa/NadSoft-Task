"use strict";

const express = require("express");
const { writeFileSync } = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
app.use(cors());
const Countries = require("./app/models/countries.model.js");
const superagent = require("superagent");

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({ extended: true })
); /* bodyParser.urlencoded() is deprecated */

//Database connection
const dbURL = process.env.DB_CONNECTION;
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.log(error);
  });

// Home page Route
app.get("/", (req, res) => {
  res.send("Hello from home page");
});

// Path to store the response from api
const path = "./app/jsonFiles/countries.json";
app.get("/allCountries", (req, res) => {
  superagent.get("https://restcountries.com/v3.1/all").then((response) => {
    let allCountries = response.body;
    let country;
    allCountries.map((items) => {
      country = new Countries({
        name: items.name.official,
        languages: items.languages,
        CCA2: items.cca2,
        CCA3: items.cca3,
        CCN3: items.ccn3,
        currencies: items.currencies,
        region: items.region,
        latitudeAndLongitude: items.latlng,
      });
      country.save();
    });
    res.status(200).send(allCountries);
    writeFileSync(path, JSON.stringify(allCountries, null, 2), 'utf8');
  });
});

app.get("/download", function (req, res) {
  // example if i got the isAdmin property in headers to check if the user is admin or not (from frontEnd side)

  // try {
  //   if(req.headers.isAdmin == 'X-ADMIN=1') {
  //     const file = `${path}`;
  //     res.download(file);
  //   }
  // } catch (error) {
  //   throw new Error('You are not authorized to download the file');
  // }

  // download for everyone (onlcick on button)
  const file = `${path}`;
  res.download(file);
});

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
