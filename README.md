# Broadcaster API

host demo = http://51.107.74.99:8082
host botv = http://botv.io:9008

-   GET ALL
    curl --location --request GET '/broadcastfb/:appId'

-   GET
    curl --location --request GET '/broadcastfb/:appId/:userId'

-   ADD
    curl --location --request POST '/broadcastfb/records'
    --data-raw '{
    "userId": "2773064286121758",
    "appId": "5e41873e841b21001138563b",
    "middlewareId": "cirtana",
    "callbackUrl": "https://botv.io/api/middleware/facebook/:pageId/send"
    }'

-   DELETE
    curl --location --request DELETE '/broadcastfb/records/:appId/:userId'

-   SEND
    curl --location --request POST '/broadcastfb/records/:appId'
    --data-raw '{
    "text": "test from broadcast service",
    "tag": "CONFIRMED_EVENT_UPDATE",
    "pageId" : "pageId"
    }'
