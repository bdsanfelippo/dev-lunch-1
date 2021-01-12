const path = require("path");

module.exports = {
    entry: ["./src/index.ts"],
    output: {
        path: path.resolve(__dirname, "../lib/udm"),
        filename: "dev-lunch-1.bundle.js",
        library: "DevLunch1",
        libraryTarget: "umd",
        publicPath: "/devLunch1/"
    },
    resolve: {
        extensions: [".ts", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
};
