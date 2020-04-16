const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dbServices = require("./db/redis");
const middlewareServices = require("./apis/middleware");
const app = express();
const server = require("http").Server(app);
const port = 9008;
var url = require("url");

app.use(cors());
app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

// parse application/json
app.use(bodyParser.json());

//SEND TO ALL
app.post("/broadcastfb/records/:appId", (req, res) => {
    // allows the broadcasting of messages to facebook users
    const { delay = 150, text, attachements, tag } = req.body;
    dbServices.getFacebookBroadcastRecords(req.params.appId, (err, sessions) => {
        sessions.forEach((record, i) => {
            console.log(record);
            record.callbackUrl = url
                .format({
                    protocol: req.protocol,
                    host: req.get("host"),
                })
                .includes("9008")
                ? record.callbackUrl.replace("http://middleware", "https://botv.io/api/middleware")
                : record.callbackUrl.replace("http://middleware", "https://demo.botv.io/api/middleware");

            setTimeout(() => {
                middlewareServices.call(
                    Object.assign(record, {
                        response: text,
                        attachements: attachements,
                        tag: tag || "CONFIRMED_EVENT_UPDATE",
                    })
                );
            }, i * delay);
        });
        res.end();
    });
});

//Get user
app.get("/broadcastfb/:appId/:userId", (req, res) => {
    dbServices.getFacebookBroadcastRecord(req.params, (err, handout) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ entities: { success: "FALSE" } });
        }
        res.status(200).json({ entities: { success: "TRUE", user: handout } });
    });
});

//Get All BrodcastFB users
app.get("/broadcastfb/:appId", (req, res) => {
    const { appId } = req.params;
    dbServices.getFacebookBroadcastRecords(appId, (err, handouts) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ entities: { success: "FALSE" } });
        }
        res.status(200).json({ entities: { success: "TRUE", users: handouts } });
    });
});

//Add BrodcastFB user
app.post("/broadcastfb/records", (req, res) => {
    console.log("ADD", req.body);
    if (req.body.callbackUrl) req.body.callbackUrl = decodeURIComponent(req.body.callbackUrl);
    //TODO tmo solution
    req.body.callbackUrl = url
        .format({
            protocol: req.protocol,
            host: req.get("host"),
        })
        .includes("9008")
        ? req.body.callbackUrl.replace("http://middleware", "https://botv.io/api/middleware")
        : req.body.callbackUrl.replace("http://middleware", "https://demo.botv.io/api/middleware");
    console.log("Add CallBAack URL ", req.body.callbackUrl);
    if (req.body.middlewareId != "cirtana") {
        dbServices.addBroadcastRecord(req.body, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ entities: { success: "FALSE" } });
            }
            res.status(200).json({ entities: { success: "TRUE" } });
        });
    } else
        return res.status(500).json({
            entities: {
                success: "FALSE",
                msg: "USER IS FROM " + req.body.middlewareId + " MUST BE FROM FACEBOOK",
            },
        });
});

//Remove BrodcastFB user
app.delete("/broadcastfb/records/:appId/:userId", (req, res) => {
    dbServices.removeBroadcastRecord(req.params, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ entities: { success: "FALSE" } });
        }
        res.status(200).json({ entities: { success: "TRUE" } });
    });
});

server.listen(port, () => console.log("broadcaster is up and running on ", port));
