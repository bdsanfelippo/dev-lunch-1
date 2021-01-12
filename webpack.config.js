// these correspond to the npm script commands for running webpack
const DEVELOPMENT_TARGET = "pack-dev";
const PRODUCTION_TARGET = "pack-prod";

const TARGET = process.env.npm_lifecycle_event;
if (TARGET === DEVELOPMENT_TARGET) {
    module.exports = require("./webpack/webpack.config.dev");
}
if (TARGET === PRODUCTION_TARGET) {
    module.exports = require("./webpack/webpack.config.prod");
}
