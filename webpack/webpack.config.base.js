const path = require("path");

module.exports = {
    entry: ["./src/index.ts"],
    output: {
        path: path.resolve(__dirname, "../lib/udm"),
        filename: "typescript-template.bundle.js",
        library: "TypescriptTemplate",
        libraryTarget: "umd",
        publicPath: "/typescriptTemplate/"
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
