const request = require("util").promisify(require("request"));

module.exports = (() => {
    function call({ callbackUrl, middleware, userId, response, attachements, tag }) {
        return request({
            url: callbackUrl,
            method: "POST",
            json: {
                middleware,
                userId,
                output: { response, attachements },
                tag,
            },
        });
    }
    return {
        call,
    };
})();
