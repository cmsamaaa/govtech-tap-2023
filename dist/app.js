"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
app.get('/', (req, res, next) => {
    res.send('Hello World!');
});
app.listen(3000);
