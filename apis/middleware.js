const request = require("util").promisify(require("request"));

module.exports = (() => {
  function call({ callbackUrl, middleware, userId, response, attachements, tag }) {
    // TODO TEMP SOLUTION FOR TOPNET
    callbackUrl = callbackUrl.replace("https://chatbot.topnet.tn/api/middleware", "http://middleware");
    callbackUrl = callbackUrl.replace("https://chatbot2.topnet.tn/api/middleware", "http://middleware");
    return request({
      url: callbackUrl,
      method: "POST",
      json: {
        middleware,
        userId,
        output: { response, attachements },
        tag
      }
    });
  }
  return {
    call
  };
})();
