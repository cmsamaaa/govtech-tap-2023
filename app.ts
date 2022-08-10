import {insertSeed} from "./libs/mongodb.seed";

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const errorController = require('./controllers/error');

const householdRoutes = require('./routes/household');

if (process.env.NODE_ENV !== 'test')
    require('dotenv').config({path: path.resolve(__dirname, '../.env')});
else
    require('dotenv').config({path: path.resolve(__dirname, '../.env.test')});

const MONGODB_URI = process.env.MONGODB_URI;
const APP_PORT = process.env.PORT ? process.env.PORT : 3000;

const app = express();

/* Parsing the body of the request. */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/* Allowing the server to accept requests from the client. */
const corsOptions = {
    methods: "GET, POST, PUT, DELETE, OPTIONS"
}
app.use(cors(corsOptions));

/* Telling the app to use the householdRoutes file for all requests that start with /household. */
app.use('/household', householdRoutes);

/* A error controller that is called when the request is not handled by any other controllers. */
app.use(errorController.get404);

/* Connecting to the database and listening to port 3000. */
mongoose.connect(MONGODB_URI)
    .then((result: any) => {
        /* Calling the database seeding function. */
        insertSeed().then((result: any) => {
            app.listen(APP_PORT);
        });
    })
    .catch((err: any) => {
        console.log(err);
    });

module.exports = app;