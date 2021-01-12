const merge = require("webpack-merge");
const baseConfig = require("./webpack.config.base");
const webpack = require("webpack");
const path = require("path");

const devConfig = merge(baseConfig, {
    mode: "development",
    // the context must be set accordingly so that webpack-dev-middleware will use the proper context
    // when using the standalone app
    context: path.resolve(__dirname, "../"),
    module: {
        rules: [
            // override the babel-loader definition to add the options
            {
                test: /\.(ts|js)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    // this option is needed so that webpack-dev-middleware will use the proper context
                    // when using the standalone app
                    cwd: path.resolve(__dirname, "../")
                }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
});

module.exports = devConfig;
