var Keen = require('keen-js');

module.exports = (function(){
    var keen = {};

    keen.client = new Keen({
        projectId: global.config.server.keen.pid,
        writeKey: global.config.server.keen.writeKey,
        readKey: global.config.server.keen.readKey,
        protocol: "http",
        host: "api.keen.io/3.0",
        requestType: "jsonp"
    });

    return keen;
})();