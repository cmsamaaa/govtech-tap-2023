"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const householdRoutes = require('./routes/household');
const MONGODB_URI = 'mongodb://localhost:27017/govtech_tap';
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res, next) => {
    res.send('Hello World!');
});
app.use('/household', householdRoutes);
mongoose.connect(MONGODB_URI)
    .then((result) => {
    app.listen(3000);
})
    .catch((err) => {
    console.log(err);
});
