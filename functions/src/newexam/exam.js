const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");


const app = express();

app.use(cors({origin: true}));

app.get("/:id", (req, res)=>{
  res.send("hello world");
});


exports.examExpress = functions.https.onRequest(app);
