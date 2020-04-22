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
        getFacebookBroadcastRecord(data, (err , record)=>{
            const {appId , category , userId, callbackUrl, middlewareId} = data
            if(err) console.log(err)
            console.log(record , "record")
            if(record){
                let categories =  record.categories ?record.categories : [];
                if(categories.length){
                    let categoryFound = categories.find(el=> el === category);
                    console.log(categoryFound , "categoryFound1")
                    if(!categoryFound){
                        categories.push(category)
                    }
                }else{
                    categories.push(category)
                }
                const serilized_data = JSON.stringify({appId , categories , userId, callbackUrl, middlewareId});
                client.hset(broadcastKey + ":" + appId, userId, serilized_data, cb);
            }else{
                const serilized_data = JSON.stringify({appId , categories : [category] , userId, callbackUrl, middlewareId});
                client.hset(broadcastKey + ":" + appId, userId, serilized_data, cb);
            }
        })
    }

    function removeBroadcastRecord(data, cb) {
        const {appId , userId , category} = data
        if(category){
            getFacebookBroadcastRecord({appId , userId , category}, (err , record)=>{
                if(err) console.log(err)
                if(record){
                    let categories = record.categories.filter(el=> el !== category)
                    const serilized_data = JSON.stringify({...record , categories});
                    client.hset(broadcastKey + ":" + appId, userId, serilized_data, cb);
                }
            })
        }else{
            client.hdel(broadcastKey + ":" + data.appId, data.userId, cb);
        }
        
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
