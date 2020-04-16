const redis = require("redis"),
    { redisConfig } = require("./config"),
    client = redis.createClient(redisConfig);
console.log(redisConfig);
client.on("error", function (err) {
    console.log("[Error]\t" + err);
});

module.exports = (() => {
    const broadcastKey = "broadcast";

    function addBroadcastRecord(data, cb) {
        const serilized_data = JSON.stringify(data);
        client.hset(broadcastKey + ":" + data.appId, data.userId, serilized_data, cb);
    }

    function removeBroadcastRecord(data, cb) {
        client.hdel(broadcastKey + ":" + data.appId, data.userId, cb);
    }

    function getFacebookBroadcastRecords(appId, cb) {
        console.log(appId);
        client.hgetall(broadcastKey + ":" + appId, (err, results) => {
            if (err) cb(err);
            if (!results) return cb(null, []);
            console.log(Object.keys(results));
            const sessions = Object.values(results).map((session) => JSON.parse(session));
            cb(null, sessions);
        });
    }

    function getFacebookBroadcastRecord(data, cb) {
        client.hget(broadcastKey + ":" + data.appId, data.userId, (err, result) => {
            if (err) cb(err);
            if (!result) return cb(null, []);
            cb(null, JSON.parse(result));
        });
    }

    return {
        addBroadcastRecord,
        removeBroadcastRecord,
        getFacebookBroadcastRecords,
        getFacebookBroadcastRecord,
    };
})();
