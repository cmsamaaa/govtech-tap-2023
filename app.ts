import {Request, Response, NextFunction} from "express";

const express = require('express');

const app = express();

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!')
});

app.listen(3000);
