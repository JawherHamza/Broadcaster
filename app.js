const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dbServices = require("./db/redis");
const middlewareServices = require("./apis/middleware");
const app = express();
const server = require("http").Server(app);
const port = 9008;
app.use(cors());
app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// parse application/json
app.use(bodyParser.json());

app.post("/broadcastfb/records/:appId", (req, res) => {
  // allows the broadcasting of messages to facebook users
  const { delay = 500, text, attachements, tag } = req.body;
  dbServices.getFacebookBroadcastRecords(req.params.appId, (err, sessions) => {
    sessions.forEach((record, i) => {
      console.log(record);
      setTimeout(() => {
        middlewareServices.call(
          Object.assign(record, {
            response: text,
            attachements: attachements,
            tag: tag || "CONFIRMED_EVENT_UPDATE"
          })
        );
      }, i * delay);
    });
    res.end();
  });
});

//Get All BrodcastFB users
app.get("/broadcastfb/:appId", (req, res) => {
  const { appId } = req.params;
  dbServices.getFacebookBroadcastRecords(appId, (err, handouts) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    res.json(handouts);
  });
});

//Add BrodcastFB user
app.post("/broadcastfb/records", (req, res) => {
  console.log(req, res);
  dbServices.addBroadcastRecord(req.body, err => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    res.end();
  });
});

//Remove BrodcastFB user
app.delete("/broadcastfb/records/:appId/:userId", (req, res) => {
  dbServices.removeBroadcastRecord(req.params, err => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    res.end();
  });
});

server.listen(port, () => console.log("broadcaster is up and running"));
