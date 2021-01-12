const merge = require("webpack-merge");
const baseConfig = require("./webpack.config.base");

module.exports = merge(baseConfig, {
    mode: "production"
    // Add custom webpack modifications when needed in future.
});
