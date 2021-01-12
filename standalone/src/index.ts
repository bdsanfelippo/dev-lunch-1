/**
 * (C) Johnson Controls, Inc. 2020.
 *     Use or copying of all or any part of this program, except as
 *     permitted in writing by Johnson Controls, is prohibited.
 */

import express from "express";
import * as config from "./config.json";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

const app = express();

// serve everything in the public folder as static files
app.use(express.static("public"));

// serve up this library as a hot-reload
const webpackConfig = require("../../webpack/webpack.config.dev");
// add "webpack-hot-middleware/client" to start of array
// this is done here so that the library can be run through webpack on its own
// without dependency on the standalone library
webpackConfig.entry.unshift("webpack-hot-middleware/client");

const compiler = webpack(webpackConfig);
app.use(
    webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath
    })
);
app.use(webpackHotMiddleware(compiler));

app.get("/", (req, res) => {
    res.sendFile(__dirname, "index.html");
});

// TODO: Define or load test API here if desired.

app.listen(config.port, () => {
    console.log(
        `Started standalone testing web app. Listening on port ${config.port}`
    );
});
